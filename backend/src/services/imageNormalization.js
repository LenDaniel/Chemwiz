const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');
const MAX_BYTES = 2 * 1024 * 1024, MAX_PIXELS = 2000000, MAX_EDGE = 4096;
const fail = message => { throw Object.assign(new Error(message), { statusCode: 400, code: 'CONTENT_MEDIA_INVALID' }); };
function dimensions(width,height) { if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > MAX_EDGE || height > MAX_EDGE || width*height > MAX_PIXELS) fail('Use an image up to 4,096 pixels per side and two million pixels in total.'); }
function pngPreflight(bytes) {
  if (bytes.length < 45 || bytes.subarray(12,16).toString() !== 'IHDR' || bytes.readUInt32BE(8) !== 13) fail('Invalid PNG header.');
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20),depth=bytes[24],type=bytes[25],channels={0:1,2:3,3:1,4:2,6:4}[type];
  dimensions(width,height);
  const depths=type===0?[1,2,4,8,16]:type===3?[1,2,4,8]:[8,16];
  if (!channels || !depths.includes(depth) || bytes[26]!==0 || bytes[27]!==0 || bytes[28]!==0) fail('Use a standard, non-interlaced PNG image.');
  const chunks=[];let offset=8, ended=false, count=0, palette=false, transparency=false, gamma=false;
  while(offset+12<=bytes.length) {
    const length=bytes.readUInt32BE(offset),name=bytes.subarray(offset+4,offset+8).toString('latin1');
    if (++count>1024 || !/^[A-Za-z]{4}$/.test(name)) fail('Invalid or excessively fragmented PNG chunks.');
    if (name==='IHDR' && (offset!==8 || length!==13)) fail('PNG must contain one initial image header.');
    if (name==='PLTE') { if (palette || length<3 || length>768 || length%3 || chunks.length) fail('Invalid PNG colour palette.'); palette=true; }
    if (name==='tRNS') { if (transparency || chunks.length || type===3 && (!palette || length>256) || type===0 && length!==2 || type===2 && length!==6 || ![0,2,3].includes(type)) fail('Invalid PNG transparency.'); transparency=true; }
    if (name==='gAMA') { if (gamma || length!==4) fail('Invalid PNG gamma.'); gamma=true; }
    if(length>MAX_BYTES || offset+12+length>bytes.length) fail('PNG data is truncated or oversized.');
    if(name==='acTL' || name==='fcTL' || name==='fdAT') fail('Animated PNG images are not supported.');
    if(name==='IDAT')chunks.push(bytes.subarray(offset+8,offset+8+length));
    offset+=length+12;
    if(name==='IEND'){if(length!==0)fail('Invalid PNG ending.');ended=true;break;}
  }
  if(!ended || !chunks.length || offset!==bytes.length)fail('Use a complete PNG without appended files.');
  const expected=(Math.ceil(width*channels*depth/8)+1)*height;
  try {if(zlib.inflateSync(Buffer.concat(chunks),{maxOutputLength:expected+1}).length!==expected)fail('PNG pixels do not match the declared dimensions.');}
  catch {fail('The PNG could not be decoded within its pixel limit.');}
}
function orientation(data) {
  let offset=2;
  while(offset+4<=data.length && data[offset]===255) {
    const marker=data[offset+1];offset+=2;
    if(marker===0xda || marker===0xd9)break;
    if(marker===0x01 || marker>=0xd0 && marker<=0xd7)continue;
    const size=data.readUInt16BE(offset);if(size<2 || offset+size>data.length)break;
    if(marker===0xe1 && size>=16 && data.subarray(offset+2,offset+8).toString('ascii')==='Exif\0\0') {
      const start=offset+8,end=offset+size,little=data.subarray(start,start+2).toString()==='II';
      if(!little && data.subarray(start,start+2).toString()!=='MM')return 1;
      const u16=p=>p>=start&&p+2<=end?(little?data.readUInt16LE(p):data.readUInt16BE(p)):null;
      const u32=p=>p>=start&&p+4<=end?(little?data.readUInt32LE(p):data.readUInt32BE(p)):null;
      if(u16(start+2)!==42)return 1;
      const relative=u32(start+4);if(relative===null)return 1;const table=start+relative,count=u16(table);
      if(count===null || count>256)return 1;
      for(let i=0;i<count;i++){const p=table+2+i*12;if(p+12>end)break;if(u16(p)===0x112 && u16(p+2)===3 && u32(p+4)===1){const value=u16(p+8);return value>=1&&value<=8?value:1;}}
    }
    offset+=size;
  }
  return 1;
}
function orient(raw,value) {
  if(value===1)return {data:raw.data,width:raw.width,height:raw.height};
  const w=raw.width,h=raw.height,width=value>=5?h:w,height=value>=5?w:h,data=Buffer.alloc(width*height*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++) {
    const [a,b]=value===2?[w-1-x,y]:value===3?[w-1-x,h-1-y]:value===4?[x,h-1-y]:value===5?[y,x]:value===6?[h-1-y,x]:value===7?[h-1-y,w-1-x]:[y,w-1-x];
    const from=(y*w+x)*4,to=(b*width+a)*4;for(let c=0;c<4;c++)data[to+c]=raw.data[from+c];
  }
  return {data,width,height};
}
function normalizeImage(input,declaredType) {
  if(!Buffer.isBuffer(input) || !input.length || input.length>MAX_BYTES)fail('Choose a PNG or JPEG file no larger than 2 MiB.');
  const png=input.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpg=input[0]===255&&input[1]===216&&input[2]===255;
  const mime=png?'image/png':jpg?'image/jpeg':null;
  if(!mime || mime!==declaredType)fail('The file contents must match its PNG or JPEG content type. SVG, PDF, HTML and other files are not accepted.');
  let raw,bytes;
  try {
    if(png){pngPreflight(input);raw=PNG.sync.read(input,{checkCRC:true});dimensions(raw.width,raw.height);bytes=PNG.sync.write({width:raw.width,height:raw.height,data:raw.data},{colorType:6,inputColorType:6,bitDepth:8});}
    else {if(input[input.length-2]!==255 || input[input.length-1]!==217)fail('Use a complete JPEG without appended files.');raw=jpeg.decode(input,{useTArray:true,tolerantDecoding:false,maxResolutionInMP:2,maxMemoryUsageInMB:48});dimensions(raw.width,raw.height);raw=orient(raw,orientation(input));bytes=jpeg.encode({data:raw.data,width:raw.width,height:raw.height},90).data;}
  } catch(error) {if(error.code==='CONTENT_MEDIA_INVALID')throw error;fail('This image is corrupt or exceeds the supported decoding limits.');}
  if(bytes.length>MAX_BYTES)fail('The decoded image is too large. Resize it or use a smaller JPEG before uploading.');
  return {bytes,mime,width:raw.width,height:raw.height,byteLength:bytes.length,fileHash:crypto.createHash('sha256').update(bytes).digest('hex'),normalization:'decoded-and-reencoded-v1'};
}
module.exports={normalizeImage,MAX_BYTES,MAX_PIXELS,MAX_EDGE};

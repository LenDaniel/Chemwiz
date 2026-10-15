// [z, sym, name, mass, category, group, period]
// category codes: am=alkali metal, ae=alkaline earth, tm=transition,
// pt=post-transition, ml=metalloid, nm=nonmetal, hl=halogen,
// ng=noble gas, ln=lanthanide, ac=actinide.
// Period 9 = lanthanide row, period 10 = actinide row (display only).

export const ELEMENTS = [
  [1,'H','Hydrogen',1.008,'nm',1,1],[2,'He','Helium',4.003,'ng',18,1],
  [3,'Li','Lithium',6.94,'am',1,2],[4,'Be','Beryllium',9.012,'ae',2,2],[5,'B','Boron',10.81,'ml',13,2],[6,'C','Carbon',12.01,'nm',14,2],[7,'N','Nitrogen',14.01,'nm',15,2],[8,'O','Oxygen',16.00,'nm',16,2],[9,'F','Fluorine',19.00,'hl',17,2],[10,'Ne','Neon',20.18,'ng',18,2],
  [11,'Na','Sodium',22.99,'am',1,3],[12,'Mg','Magnesium',24.31,'ae',2,3],[13,'Al','Aluminium',26.98,'pt',13,3],[14,'Si','Silicon',28.09,'ml',14,3],[15,'P','Phosphorus',30.97,'nm',15,3],[16,'S','Sulfur',32.06,'nm',16,3],[17,'Cl','Chlorine',35.45,'hl',17,3],[18,'Ar','Argon',39.95,'ng',18,3],
  [19,'K','Potassium',39.10,'am',1,4],[20,'Ca','Calcium',40.08,'ae',2,4],[21,'Sc','Scandium',44.96,'tm',3,4],[22,'Ti','Titanium',47.87,'tm',4,4],[23,'V','Vanadium',50.94,'tm',5,4],[24,'Cr','Chromium',52.00,'tm',6,4],[25,'Mn','Manganese',54.94,'tm',7,4],[26,'Fe','Iron',55.85,'tm',8,4],[27,'Co','Cobalt',58.93,'tm',9,4],[28,'Ni','Nickel',58.69,'tm',10,4],[29,'Cu','Copper',63.55,'tm',11,4],[30,'Zn','Zinc',65.38,'tm',12,4],[31,'Ga','Gallium',69.72,'pt',13,4],[32,'Ge','Germanium',72.63,'ml',14,4],[33,'As','Arsenic',74.92,'ml',15,4],[34,'Se','Selenium',78.97,'nm',16,4],[35,'Br','Bromine',79.90,'hl',17,4],[36,'Kr','Krypton',83.80,'ng',18,4],
  [37,'Rb','Rubidium',85.47,'am',1,5],[38,'Sr','Strontium',87.62,'ae',2,5],[39,'Y','Yttrium',88.91,'tm',3,5],[40,'Zr','Zirconium',91.22,'tm',4,5],[41,'Nb','Niobium',92.91,'tm',5,5],[42,'Mo','Molybdenum',95.95,'tm',6,5],[43,'Tc','Technetium',98,'tm',7,5],[44,'Ru','Ruthenium',101.07,'tm',8,5],[45,'Rh','Rhodium',102.91,'tm',9,5],[46,'Pd','Palladium',106.42,'tm',10,5],[47,'Ag','Silver',107.87,'tm',11,5],[48,'Cd','Cadmium',112.41,'tm',12,5],[49,'In','Indium',114.82,'pt',13,5],[50,'Sn','Tin',118.71,'pt',14,5],[51,'Sb','Antimony',121.76,'ml',15,5],[52,'Te','Tellurium',127.60,'ml',16,5],[53,'I','Iodine',126.90,'hl',17,5],[54,'Xe','Xenon',131.29,'ng',18,5],
  [55,'Cs','Caesium',132.91,'am',1,6],[56,'Ba','Barium',137.33,'ae',2,6],[57,'La','Lanthanum',138.91,'ln',3,6],
  [58,'Ce','Cerium',140.12,'ln',4,9],[59,'Pr','Praseodymium',140.91,'ln',5,9],[60,'Nd','Neodymium',144.24,'ln',6,9],[61,'Pm','Promethium',145,'ln',7,9],[62,'Sm','Samarium',150.36,'ln',8,9],[63,'Eu','Europium',151.96,'ln',9,9],[64,'Gd','Gadolinium',157.25,'ln',10,9],[65,'Tb','Terbium',158.93,'ln',11,9],[66,'Dy','Dysprosium',162.50,'ln',12,9],[67,'Ho','Holmium',164.93,'ln',13,9],[68,'Er','Erbium',167.26,'ln',14,9],[69,'Tm','Thulium',168.93,'ln',15,9],[70,'Yb','Ytterbium',173.05,'ln',16,9],[71,'Lu','Lutetium',174.97,'ln',17,9],
  [72,'Hf','Hafnium',178.49,'tm',4,6],[73,'Ta','Tantalum',180.95,'tm',5,6],[74,'W','Tungsten',183.84,'tm',6,6],[75,'Re','Rhenium',186.21,'tm',7,6],[76,'Os','Osmium',190.23,'tm',8,6],[77,'Ir','Iridium',192.22,'tm',9,6],[78,'Pt','Platinum',195.08,'tm',10,6],[79,'Au','Gold',196.97,'tm',11,6],[80,'Hg','Mercury',200.59,'tm',12,6],[81,'Tl','Thallium',204.38,'pt',13,6],[82,'Pb','Lead',207.2,'pt',14,6],[83,'Bi','Bismuth',208.98,'pt',15,6],[84,'Po','Polonium',209,'ml',16,6],[85,'At','Astatine',210,'hl',17,6],[86,'Rn','Radon',222,'ng',18,6],
  [87,'Fr','Francium',223,'am',1,7],[88,'Ra','Radium',226,'ae',2,7],[89,'Ac','Actinium',227,'ac',3,7],
  [90,'Th','Thorium',232.04,'ac',4,10],[91,'Pa','Protactinium',231.04,'ac',5,10],[92,'U','Uranium',238.03,'ac',6,10],[93,'Np','Neptunium',237,'ac',7,10],[94,'Pu','Plutonium',244,'ac',8,10],[95,'Am','Americium',243,'ac',9,10],[96,'Cm','Curium',247,'ac',10,10],[97,'Bk','Berkelium',247,'ac',11,10],[98,'Cf','Californium',251,'ac',12,10],[99,'Es','Einsteinium',252,'ac',13,10],[100,'Fm','Fermium',257,'ac',14,10],[101,'Md','Mendelevium',258,'ac',15,10],[102,'No','Nobelium',259,'ac',16,10],[103,'Lr','Lawrencium',266,'ac',17,10],
  [104,'Rf','Rutherfordium',267,'tm',4,7],[105,'Db','Dubnium',268,'tm',5,7],[106,'Sg','Seaborgium',269,'tm',6,7],[107,'Bh','Bohrium',270,'tm',7,7],[108,'Hs','Hassium',270,'tm',8,7],[109,'Mt','Meitnerium',278,'tm',9,7],[110,'Ds','Darmstadtium',281,'tm',10,7],[111,'Rg','Roentgenium',282,'tm',11,7],[112,'Cn','Copernicium',285,'tm',12,7],[113,'Nh','Nihonium',286,'pt',13,7],[114,'Fl','Flerovium',289,'pt',14,7],[115,'Mc','Moscovium',290,'pt',15,7],[116,'Lv','Livermorium',293,'pt',16,7],[117,'Ts','Tennessine',294,'hl',17,7],[118,'Og','Oganesson',294,'ng',18,7],
];

export const CATEGORIES = {
  am: { label:'Alkali metal',    color:'#e63946' },
  ae: { label:'Alkaline earth',  color:'#f77f00' },
  tm: { label:'Transition metal',color:'#c77dff' },
  pt: { label:'Post-transition', color:'#7209b7' },
  ml: { label:'Metalloid',       color:'#06a06e' },
  nm: { label:'Nonmetal',        color:'#00d4ff' },
  hl: { label:'Halogen',         color:'#ffbe0b' },
  ng: { label:'Noble gas',       color:'#e0aaff' },
  ln: { label:'Lanthanide',      color:'#f72585' },
  ac: { label:'Actinide',        color:'#b5179e' },
};

export const findByZ = (z) => ELEMENTS.find(e => e[0] === z);
export const findBySymbol = (sym) => ELEMENTS.find(e => e[1].toLowerCase() === sym.toLowerCase());

import { useId, useState } from 'react';
import './account.css';
export function PasswordField({label='Password',id:providedId,style,...props}) {
  const generated = useId();
  const id = providedId || generated;
  const [visible,setVisible] = useState(false);
  return <div className="cw-password-control">
    <input {...props} id={id} aria-label={props['aria-label'] || label} type={visible ? 'text' : 'password'} style={{...style,paddingRight:72}} />
    <button type="button" className="cw-password-toggle" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} aria-controls={id} onClick={()=>setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</button>
  </div>;
}

import emailjs from '@emailjs/browser';

export default function EmailForm() {
  const send = () => {
    emailjs.send(
      'service_id',
      'template_id',
      { message: 'Hello' },
      'public_key'
    );
  };
  return <button onClick={send}>Send</button>;
}


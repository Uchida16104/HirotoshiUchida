import emailjs from '@emailjs/browser';

emailjs.send(
  'service_id',
  'template_id',
  { message: 'Hello' },
  'public_key'
);


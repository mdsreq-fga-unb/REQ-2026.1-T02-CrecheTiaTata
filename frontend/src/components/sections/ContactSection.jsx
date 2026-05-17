import { contactCards } from '../../data/siteContent';
import ContactCard from './ContactCard';
import ContactForm from './ContactForm';

export default function ContactSection() {
  return (
    <section className="bg-stone-50 px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.85fr]">
        <ContactForm />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {contactCards.map((card) => (
            <ContactCard card={card} key={card.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

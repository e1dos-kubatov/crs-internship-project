import React from 'react';

const HelpSection = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      {/* FAQ Card */}
      <div className="flex flex-col md:flex-row bg-white shadow-2xl mb-24 border border-gray-100">
        <div className="md:w-1/3">
          <img 
            src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80" 
            alt="Customer Support" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="md:w-2/3 p-10 flex flex-col justify-center items-start">
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">How can we help you?</h2>
          <p className="text-gray-600 mb-8 leading-relaxed max-w-lg">
            By visiting our FAQ page, you can learn more about the car rental process and find quick answers to your questions.
          </p>
          <button className="bg-cwd-blue text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all">
            Frequently Asked Questions
          </button>
        </div>
      </div>

      {/* Information Content */}
      <div className="max-w-6xl text-gray-700 leading-relaxed text-sm">
        <h3 className="font-extrabold text-xl text-black mb-6 tracking-tight">CWD Makes Car Rental Easy in Kazakhstan</h3>
        <p className="mb-6">
          With CWD car rental service that can be completed within minutes, you can find solutions tailored to both operational and personal needs by using a variety of brands and models. Renting a car with CWD can be quickly done through the website, email, phone number, or at the rental office. Whether for city or intercity travels, you can easily complete your car rental transactions at CWD offices across the country.
        </p>
        <p className="mb-10">
          By selecting pickup and drop-off offices and rental dates on the website, you can choose your preferred vehicle from a range of suitable brands and models. In addition to the website, you can also complete rental transactions through CWD offices and phone numbers.
        </p>
        <h4 className="font-extrabold text-lg text-black uppercase tracking-tight">At Your Service With Our Diverse Vehicle Fleet</h4>
      </div>
    </section>
  );
};

export default HelpSection;
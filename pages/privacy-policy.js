import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white py-10 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-600">Privacy Policy</h1>
        </div>
      </header>

      <main className="container mx-auto mt-10 px-4 md:px-0">
        {/* Introduction Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            This Privacy Policy outlines how SimplyGroup collects, uses, and protects your personal
            information when you use our services. By using our services, you agree to the terms outlined in this
            policy.
          </p>
        </section>

        {/* Information Collection Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Personal Information (e.g., name, email address, phone number)</li>
            <li>Usage Data (e.g., browsing history, preferences, page interactions)</li>
            <li>Cookies and Tracking Technologies</li>
            <li>Payment Information (if applicable)</li>
          </ul>
        </section>

        {/* How We Use Information Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p>We may use the information collected for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>To provide and maintain our services</li>
            <li>To personalize user experience and improve customer service</li>
            <li>To send periodic emails or notifications regarding updates, promotions, or other relevant information</li>
            <li>To process transactions (if applicable)</li>
            <li>To analyze and monitor the usage of our website for performance and improvement</li>
          </ul>
        </section>

        {/* Information Sharing Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. However, we may share information with:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Trusted partners who assist us in operating our website, conducting our business, or serving our users, provided that they agree to keep this information confidential.</li>
            <li>Legal entities when required by law or to protect our rights, safety, or property.</li>
          </ul>
        </section>

        {/* Security Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security of Your Information</h2>
          <p>
            We implement various security measures to protect your personal information, including encrypted storage, access controls, and regular security audits to prevent unauthorized access, alteration, or disclosure of your data.
          </p>
        </section>

        {/* User Rights Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>You have the right to access, update, or delete your personal information stored on our platform.</li>
            <li>You may opt out of receiving marketing communications by following the unsubscribe instructions in the emails we send.</li>
            <li>You have the right to request a copy of the personal information we hold about you.</li>
          </ul>
        </section>

        {/* Changes to Privacy Policy Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy periodically to reflect changes in our practices, technologies, or legal requirements. Please review this page regularly for any updates.
          </p>
        </section>

        {/* Contact Us Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            Email: <a href="mailto:info@yourcompany.com" className="text-blue-500">info@yourcompany.com</a>
            <br />
            Phone: <a href="tel:+1234567890" className="text-blue-500">+123-456-7890</a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;

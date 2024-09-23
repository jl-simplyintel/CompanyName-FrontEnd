import React, { useState, useEffect } from 'react';

const About = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState('');
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [verificationAnswer, setVerificationAnswer] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate random numbers for the math problem when the component mounts
    useEffect(() => {
        generateRandomNumbers();
    }, []);

    const generateRandomNumbers = () => {
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setCaptchaError('');
        setIsSubmitting(true);

        // Check if the user's answer is correct
        const correctAnswer = num1 + num2;
        if (parseInt(verificationAnswer) !== correctAnswer) {
            setCaptchaError('Incorrect answer. Please try again.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setVerificationAnswer('');
                generateRandomNumbers();
            } else {
                setStatus(data.error || 'Something went wrong.');
            }
        } catch (error) {
            setStatus('Error sending message. Please try again later.');
            console.error('Fetch error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white text-blue-600 text-center py-8">
                <h1 className="text-4xl font-bold">About Us</h1>
            </header>

            <main className="container mx-auto mt-10 px-4">
                {/* Company Overview Section */}
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">Company Overview</h2>
                    <p className="text-lg leading-relaxed">
                        SimplyGroup is your trusted partner for discovering and connecting with local businesses.
                        We are committed to providing up-to-date and reliable business information to help you make informed decisions.
                    </p>
                </section>

                {/* Mission and Vision Section */}
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">Our Mission & Vision</h2>
                    <p className="text-lg leading-relaxed">
                        Our mission is to empower local businesses through accessibility and support, while our vision
                        is to create a thriving community of engaged customers and entrepreneurs.
                    </p>
                </section>

                {/* Team Members Section */}
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">Meet Our Team</h2>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold">John Doe</h3>
                            <p>CEO - John leads the company with a passion for innovation and growth.</p>
                        </div>
                        <div className="p-4 border rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold">Jane Smith</h3>
                            <p>COO - Jane ensures our operations run smoothly and efficiently.</p>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">Why Choose Us?</h2>
                    <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed">
                        <li>Local expertise and support</li>
                        <li>Commitment to customer satisfaction</li>
                        <li>Wide range of services tailored to your needs</li>
                    </ul>
                </section>

                {/* Contact Form Section */}
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
                    <p className="mb-4">If you have any questions or inquiries, feel free to contact us using the form below:</p>
                    {status && <p className="text-green-600 mb-4">{status}</p>}
                    {captchaError && <p className="text-red-600 mb-4">{captchaError}</p>}
                    <form id="contact-form" className="bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                aria-label="Your Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                aria-label="Your Email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Your Phone</label>
                            <input
                                type="tel"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                id="phone"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                aria-label="Your Phone"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message</label>
                            <textarea
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                id="message"
                                name="message"
                                rows="5"
                                placeholder="Type your message here"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                aria-label="Your Message"
                            ></textarea>
                        </div>
                        {/* Dynamic Math Problem Verification */}
                        <div className="mb-4">
                            <label htmlFor="verification" className="block text-sm font-medium text-gray-700">What is {num1} + {num2}?</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                id="verification"
                                placeholder="Enter your answer"
                                value={verificationAnswer}
                                onChange={(e) => setVerificationAnswer(e.target.value)}
                                required
                                aria-label="Math Problem Answer"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default About;

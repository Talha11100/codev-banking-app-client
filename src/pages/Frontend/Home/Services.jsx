import { useEffect } from 'react';
import Aos from 'aos';
import { FaShieldHalved, FaBolt, FaChartLine } from "react-icons/fa6";

const services = [
    {
        icon: <FaShieldHalved size={32} />,
        color: '#10B981',
        title: 'Bank-Grade Security',
        desc: 'Your money is protected with 256-bit AES encryption, two-factor authentication, and real-time fraud detection — the same standards used by global financial institutions.',
    },
    {
        icon: <FaBolt size={32} />,
        color: '#3B82F6',
        title: 'Instant Transfers',
        desc: 'Send money to anyone, anywhere in the world — in seconds. No waiting periods, no hidden fees. Support for 50+ currencies with live exchange rates.',
    },
    {
        icon: <FaChartLine size={32} />,
        color: '#F59E0B',
        title: 'Smart Savings',
        desc: 'Grow your wealth with competitive interest rates up to 4.5% APY. Set automated savings goals and watch your money work for you while you sleep.',
    },
]

const Services = () => {
    useEffect(() => {
        Aos.init({ duration: 1000, once: true, easing: "ease-in-out" })
    }, [])

    return (
        <section style={{
            background: 'linear-gradient(180deg, #0A1628 0%, #0f2044 100%)',
            padding: '100px 0',
        }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: '100px', padding: '6px 18px', marginBottom: '16px',
                        fontSize: '12px', fontWeight: 600, color: '#10B981',
                        textTransform: 'uppercase', letterSpacing: '1px',
                    }}>Why DigitalBank</div>
                    <h2 style={{
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                        fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
                        color: '#F1F5F9', letterSpacing: '-0.5px', marginBottom: '12px',
                    }}>Everything You Need to Succeed Financially</h2>
                    <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '520px', margin: '0 auto' }}>
                        Powerful features designed to give you complete control over your money.
                    </p>
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {services.map((s, i) => (
                        <div
                            key={s.title}
                            data-aos="fade-up"
                            data-aos-delay={i * 120}
                            style={{
                                flex: '1 1 280px', maxWidth: '360px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: '24px', padding: '36px 28px',
                                backdropFilter: 'blur(8px)',
                                transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px)'
                                e.currentTarget.style.borderColor = `${s.color}33`
                                e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${s.color}10`
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '68px', height: '68px',
                                background: `${s.color}15`,
                                border: `1px solid ${s.color}30`,
                                borderRadius: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '24px', color: s.color,
                            }}>
                                {s.icon}
                            </div>

                            <h3 style={{
                                fontFamily: "'Outfit', 'Inter', sans-serif",
                                fontSize: '20px', fontWeight: 700,
                                color: '#F1F5F9', marginBottom: '12px',
                            }}>{s.title}</h3>

                            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, marginBottom: 0 }}>
                                {s.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services

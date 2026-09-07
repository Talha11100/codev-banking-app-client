import { useEffect } from 'react';
import Aos from 'aos';
import { FaPiggyBank, FaHandshake, FaChartLine, FaBriefcase, FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const bankingProducts = [
    { icon: <FaPiggyBank size={30} />, label: 'Savings Account', desc: 'Up to 4.5% APY', color: '#10B981' },
    { icon: <FaHandshake size={30} />, label: 'Personal Loans', desc: 'From 6.9% APR', color: '#3B82F6' },
    { icon: <FaChartLine size={30} />, label: 'Investments', desc: 'Stocks & ETFs', color: '#F59E0B' },
    { icon: <FaBriefcase size={30} />, label: 'Business Banking', desc: 'For growing teams', color: '#8B5CF6' },
]

const Courses = () => {
    useEffect(() => {
        Aos.init({ duration: 1000, once: true, easing: "ease-in-out" })
    }, [])

    return (
        <>
            {/* Products Grid Section */}
            <section style={{ background: '#0A1628', padding: '100px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                            borderRadius: '100px', padding: '6px 18px', marginBottom: '16px',
                            fontSize: '12px', fontWeight: 600, color: '#10B981',
                            textTransform: 'uppercase', letterSpacing: '1px',
                        }}>Our Products</div>
                        <h2 style={{
                            fontFamily: "'Outfit', 'Inter', sans-serif",
                            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
                            color: '#F1F5F9', letterSpacing: '-0.5px', marginBottom: '12px',
                        }}>A Complete Financial Ecosystem</h2>
                        <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
                            From everyday banking to long-term investments — everything under one roof.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {bankingProducts.map((p, i) => (
                            <div
                                key={p.label}
                                data-aos="fade-up"
                                data-aos-delay={i * 100}
                                style={{
                                    flex: '1 1 200px', maxWidth: '240px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '20px', padding: '32px 24px',
                                    textAlign: 'center',
                                    backdropFilter: 'blur(8px)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-6px)'
                                    e.currentTarget.style.borderColor = `${p.color}40`
                                    e.currentTarget.style.background = `${p.color}08`
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                                }}
                            >
                                <div style={{
                                    width: '64px', height: '64px',
                                    background: `${p.color}15`,
                                    border: `1px solid ${p.color}30`,
                                    borderRadius: '16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    color: p.color,
                                }}>
                                    {p.icon}
                                </div>
                                <div style={{
                                    fontFamily: "'Outfit', 'Inter', sans-serif",
                                    fontSize: '16px', fontWeight: 700,
                                    color: '#F1F5F9', marginBottom: '6px',
                                }}>{p.label}</div>
                                <div style={{ fontSize: '13px', color: '#475569' }}>{p.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{
                background: 'linear-gradient(135deg, #0f2044 0%, #1a3a6e 50%, #0f2044 100%)',
                padding: '80px 0',
                position: 'relative',
                overflow: 'hidden',
                borderTop: '1px solid rgba(16,185,129,0.1)',
            }}>
                {/* Glow */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px', height: '300px',
                    background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }} data-aos="fade-up">
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                        borderRadius: '100px', padding: '6px 18px', marginBottom: '20px',
                        fontSize: '12px', fontWeight: 600, color: '#10B981',
                        textTransform: 'uppercase', letterSpacing: '1px',
                    }}>Get Started Today</div>

                    <h2 style={{
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                        fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800,
                        color: '#F1F5F9', letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.2,
                    }}>
                        Your Financial Future<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #10B981, #34D399)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>Starts Here</span>
                    </h2>

                    <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: '36px', maxWidth: '500px', margin: '0 auto 36px' }}>
                        Open your free DigitalBank account in under 3 minutes. No credit check, no monthly fees.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/auth/register" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: '#fff', textDecoration: 'none',
                            padding: '16px 32px', borderRadius: '12px',
                            fontWeight: 700, fontSize: '16px',
                            boxShadow: '0 8px 28px rgba(16,185,129,0.45)',
                            transition: 'all 0.3s ease',
                        }}>
                            Open Free Account <FaArrowRight size={14} />
                        </Link>
                        <Link to="/auth/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#CBD5E1', textDecoration: 'none',
                            padding: '16px 32px', borderRadius: '12px',
                            fontWeight: 600, fontSize: '16px',
                        }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Courses

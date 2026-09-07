import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Aos from 'aos'
import { FaShieldHalved, FaArrowRight } from 'react-icons/fa6'

const Hero = () => {
    useEffect(() => {
        Aos.init(
            {
                duration: 1000,
                once: true,
                easing: "ease-in-out"
            }
        )
    }, [])
// Comment added
    return (
        <section style={{
            background: 'linear-gradient(160deg, #0A1628 0%, #0f2044 50%, #0A1628 100%)',
            padding: '80px 0 100px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background glow orbs */}
            <div style={{
                position: 'absolute', top: '10%', left: '5%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', bottom: '0%', right: '10%',
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(26,58,110,0.5) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
                    {/* Left Text */}
                    <div style={{ flex: '1 1 420px' }} data-aos="fade-right">
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                            borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
                            fontSize: '13px', fontWeight: 500, color: '#10B981',
                        }}>
                            <FaShieldHalved size={12} />
                            Bank-Grade Security · 256-bit Encryption
                        </div>

                        <h1 style={{
                            fontFamily: "'Outfit', 'Inter', sans-serif",
                            fontSize: 'clamp(36px, 5vw, 60px)',
                            fontWeight: 800,
                            color: '#F1F5F9',
                            lineHeight: 1.15,
                            letterSpacing: '-1.5px',
                            marginBottom: '20px',
                        }}>
                            Bank Smarter with{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #10B981, #34D399)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>DigitalBank</span>
                        </h1>

                        <p style={{
                            fontSize: '18px', lineHeight: 1.7,
                            color: '#94A3B8', marginBottom: '36px', maxWidth: '480px',
                        }}>
                            Experience the future of banking — send money globally in seconds, earn competitive interest, and manage your wealth all in one secure platform.
                        </p>

                        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Link to="/auth/register" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                color: '#fff', textDecoration: 'none',
                                padding: '14px 28px', borderRadius: '12px',
                                fontWeight: 700, fontSize: '15px',
                                boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                                transition: 'all 0.3s ease',
                            }}>
                                Open Free Account <FaArrowRight size={14} />
                            </Link>
                            <Link to="/auth/login" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                color: '#CBD5E1', textDecoration: 'none',
                                padding: '14px 28px', borderRadius: '12px',
                                fontWeight: 600, fontSize: '15px',
                                transition: 'all 0.3s ease',
                            }}>
                                Login to Dashboard
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
                            {[
                                { icon: '🏆', label: 'Best Digital Bank 2024' },
                                { icon: '🔒', label: 'FDIC Insured' },
                                { icon: '⚡', label: 'Instant Transfers' },
                            ].map(b => (
                                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' }}>
                                    <span>{b.icon}</span> {b.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Dashboard Card Mockup */}
                    <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center' }} data-aos="fade-left">
                        <div style={{
                            width: '340px', maxWidth: '100%',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '24px',
                            padding: '28px',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(16,185,129,0.08)',
                        }}>
                            {/* Card header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Total Balance</div>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color: '#F1F5F9', fontFamily: "'Outfit', sans-serif" }}>$24,830.50</div>
                                </div>
                                <div style={{
                                    background: 'linear-gradient(135deg, #10B981, #059669)',
                                    borderRadius: '12px', padding: '10px',
                                    color: '#fff', fontSize: '20px',
                                }}>🏦</div>
                            </div>

                            {/* Mini chart bars */}
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '60px', marginBottom: '24px' }}>
                                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((h, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        height: `${h}%`,
                                        background: i === 11
                                            ? 'linear-gradient(180deg, #10B981, #059669)'
                                            : `rgba(16,185,129,${0.15 + i * 0.02})`,
                                        borderRadius: '4px',
                                        transition: 'height 0.3s ease',
                                    }} />
                                ))}
                            </div>

                            {/* Quick actions */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[
                                    { icon: '↑', label: 'Send', color: '#10B981' },
                                    { icon: '↓', label: 'Receive', color: '#3B82F6' },
                                    { icon: '💳', label: 'Pay', color: '#F59E0B' },
                                    { icon: '📊', label: 'Invest', color: '#8B5CF6' },
                                ].map(a => (
                                    <div key={a.label} style={{
                                        flex: 1, textAlign: 'center',
                                        background: 'rgba(255,255,255,0.04)',
                                        borderRadius: '10px', padding: '10px 4px',
                                    }}>
                                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>{a.icon}</div>
                                        <div style={{ fontSize: '11px', color: '#64748B' }}>{a.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Recent transactions */}
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent</div>
                                {[
                                    { name: 'Netflix', amount: '-$15.99', color: '#EF4444' },
                                    { name: 'Salary', amount: '+$4,200', color: '#10B981' },
                                    { name: 'Amazon', amount: '-$89.50', color: '#EF4444' },
                                ].map(t => (
                                    <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <span style={{ fontSize: '13px', color: '#CBD5E1' }}>{t.name}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: t.color }}>{t.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero

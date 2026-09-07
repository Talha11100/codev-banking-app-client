import { useEffect } from 'react';
import Aos from 'aos';
import { FaUserGroup, FaMoneyBillTransfer, FaGlobe, FaShieldHalved } from "react-icons/fa6";
import * as RC from "react-countup";

const CountUp = RC.default.default;

const statsData = [
    {
        icon: <FaUserGroup size={28} />,
        end: 1,
        suffix: 'M+',
        label: 'Active Users',
        desc: 'Trusted worldwide',
        color: '#10B981',
    },
    {
        icon: <FaMoneyBillTransfer size={28} />,
        end: 50,
        suffix: 'B+',
        prefix: '$',
        label: 'Transactions',
        desc: 'Processed securely',
        color: '#3B82F6',
    },
    {
        icon: <FaGlobe size={28} />,
        end: 150,
        suffix: '+',
        label: 'Countries',
        desc: 'Global reach',
        color: '#F59E0B',
    },
    {
        icon: <FaShieldHalved size={28} />,
        end: 99.9,
        suffix: '%',
        decimals: 1,
        label: 'Uptime',
        desc: 'Always available',
        color: '#8B5CF6',
    },
]

const Stats = () => {
    useEffect(() => {
        Aos.init({ duration: 1000, once: true, easing: "ease-in-out" })
    }, [])

    return (
        <section style={{
            background: '#0A1628',
            padding: '80px 0',
            position: 'relative',
        }}>
            {/* Section divider top */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', marginBottom: '80px' }} />

            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '60px' }} data-aos="fade-up">
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                        borderRadius: '100px', padding: '6px 18px', marginBottom: '16px',
                        fontSize: '12px', fontWeight: 600, color: '#10B981',
                        textTransform: 'uppercase', letterSpacing: '1px',
                    }}>By The Numbers</div>
                    <h2 style={{
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                        fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
                        color: '#F1F5F9', letterSpacing: '-0.5px', marginBottom: '12px',
                    }}>Trusted by Millions Globally</h2>
                    <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
                        Join over a million customers who rely on DigitalBank for secure, intelligent financial management.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {statsData.map((stat, i) => (
                        <div
                            key={stat.label}
                            data-aos="fade-up"
                            data-aos-delay={i * 100}
                            style={{
                                flex: '1 1 200px', maxWidth: '260px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: '20px', padding: '32px 24px',
                                textAlign: 'center',
                                backdropFilter: 'blur(8px)',
                                transition: 'transform 0.3s ease, border-color 0.3s ease',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = `${stat.color}33` }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: '60px', height: '60px',
                                background: `${stat.color}15`,
                                border: `1px solid ${stat.color}30`,
                                borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px',
                                color: stat.color,
                            }}>
                                {stat.icon}
                            </div>

                            {/* Counter */}
                            <div style={{
                                fontFamily: "'Outfit', 'Inter', sans-serif",
                                fontSize: '42px', fontWeight: 800,
                                color: '#F1F5F9', lineHeight: 1, marginBottom: '8px',
                            }}>
                                {stat.prefix || ''}
                                <CountUp end={stat.end} duration={3} enableScrollSpy scrollSpyOnce decimals={stat.decimals || 0} />
                                {stat.suffix}
                            </div>

                            <div style={{ fontSize: '16px', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>{stat.label}</div>
                            <div style={{ fontSize: '13px', color: '#475569' }}>{stat.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Stats

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaLocationDot, FaEnvelope, FaPhone, FaShieldHalved } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Copyright = () => {
    const year = new Date().getFullYear()

    const footerLinks = {
        Company: [
            { label: 'About Us', to: '/about' },
            { label: 'Careers', to: '/careers' },
            { label: 'Press', to: '/press' },
            { label: 'Contact', to: '/contact' },
        ],
        Products: [
            { label: 'Savings Account', to: '/' },
            { label: 'Personal Loans', to: '/' },
            { label: 'Investments', to: '/' },
            { label: 'Business Banking', to: '/' },
        ],
    }

    const socials = [
        { icon: <FaFacebookF size={16} />, label: 'Facebook' },
        { icon: <FaXTwitter size={16} />, label: 'Twitter' },
        { icon: <FaInstagram size={16} />, label: 'Instagram' },
        { icon: <FaLinkedinIn size={16} />, label: 'LinkedIn' },
    ]

    return (
        <footer style={{
            background: 'linear-gradient(180deg, #07111e 0%, #0A1628 100%)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
            <div className="container" style={{ padding: '64px 16px 40px' }}>
                <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>

                    {/* Brand Column */}
                    <div style={{ flex: '1 1 260px', maxWidth: '300px' }}>
                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: '16px',
                                boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                            }}>🏦</div>
                            <span style={{
                                fontFamily: "'Outfit', 'Inter', sans-serif",
                                fontWeight: 700, fontSize: '20px', color: '#F1F5F9',
                            }}>Nexa<span style={{ color: '#10B981' }}>Bank</span></span>
                        </div>

                        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>
                            Empowering financial freedom through secure, intelligent digital banking. Your money, your rules.
                        </p>

                        {/* FDIC Badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                            borderRadius: '8px', padding: '6px 12px',
                            fontSize: '12px', color: '#10B981', fontWeight: 500, marginBottom: '24px',
                        }}>
                            <FaShieldHalved size={12} /> FDIC Insured · Member SIPC
                        </div>

                        {/* Socials */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {socials.map(s => (
                                <button
                                    key={s.label}
                                    aria-label={s.label}
                                    style={{
                                        width: '36px', height: '36px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#64748B', cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.12)'; e.currentTarget.style.color = '#10B981'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                                >
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} style={{ flex: '1 1 140px' }}>
                            <h4 style={{
                                fontFamily: "'Outfit', 'Inter', sans-serif",
                                fontSize: '14px', fontWeight: 700,
                                color: '#F1F5F9', marginBottom: '20px',
                                textTransform: 'uppercase', letterSpacing: '0.5px',
                            }}>{category}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {links.map(l => (
                                    <Link key={l.label} to={l.to} style={{
                                        fontSize: '14px', color: '#475569', textDecoration: 'none',
                                        transition: 'color 0.2s ease',
                                    }}
                                        onMouseEnter={e => e.target.style.color = '#10B981'}
                                        onMouseLeave={e => e.target.style.color = '#475569'}
                                    >{l.label}</Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Contact Column */}
                    <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{
                            fontFamily: "'Outfit', 'Inter', sans-serif",
                            fontSize: '14px', fontWeight: 700,
                            color: '#F1F5F9', marginBottom: '20px',
                            textTransform: 'uppercase', letterSpacing: '0.5px',
                        }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { icon: <FaLocationDot size={14} />, text: '101 Financial District, New York, NY' },
                                { icon: <FaPhone size={14} />, text: '+1 (800) 639-2265' },
                                { icon: <FaEnvelope size={14} />, text: 'support@DigitalBank.com' },
                            ].map((c, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '14px' }}>
                                    <span style={{ color: '#10B981', marginTop: '2px', flexShrink: 0 }}>{c.icon}</span>
                                    {c.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 16px' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#334155' }}>
                        © {year} DigitalBank. All rights reserved. Licensed & Regulated by Financial Authority.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
                            <Link key={t} to="/" style={{ fontSize: '13px', color: '#334155', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.target.style.color = '#10B981'}
                                onMouseLeave={e => e.target.style.color = '#334155'}
                            >{t}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Copyright

import React from "react";

export const SectionTeamSection = () => {
    // Sample mentor data
    const mentors = [
        {
            name: "Matthew Ryan",
            role: "Product Designer",
            bgColor: "#ffd3e1",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face"
        },
        {
            name: "Daniel Joseph",
            role: "Software Engineer",
            bgColor: "#ffd3e1",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
            offset: true
        },
        {
            name: "Adam Bennett",
            role: "Digital Marketer",
            bgColor: "#fbecc0",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face"
        },
        {
            name: "James Michael",
            role: "Digital Marketer",
            bgColor: "#fceedf",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop&crop=face",
            offset: true
        }
    ];

    // Inline styles with CSS animations
    const inlineStyles = `
        .fade-in-animation {
            animation: fadeIn 1s ease forwards;
        }
        
        .fade-up-animation {
            animation: fadeUp 1s ease forwards;
        }
        
        .shimmer-animation {
            animation: shimmer 8s infinite;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200% 100%;
        }
        
        .image-glow-animation {
            animation: imageGlow 2s infinite alternate;
        }
        
        .marquee-animation {
            animation: marquee 10s infinite linear;
        }
        
        .hover-scale:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }
        
        .button-hover:hover {
            background-color: #f3f4f6;
        }
        
        .button-icon-hover:hover {
            background-color: #374151;
        }
        
        @keyframes fadeIn {
            0% {
                opacity: 0;
                transform: translateY(-10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeUp {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes shimmer {
            0%, 90%, 100% {
                background-position: -200% 0;
            }
            30%, 60% {
                background-position: 200% 0;
            }
        }
        
        @keyframes marquee {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-100%);
            }
        }
        
        @keyframes imageGlow {
            0% {
                opacity: 0;
            }
            10% {
                opacity: 0.7;
            }
            100% {
                opacity: 0.4;
            }
        }
    `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
            <div style={{
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#011813',
                padding: '4rem 1rem',
            }}>
                <div style={{
                    maxWidth: '80rem',
                    margin: '0 auto',
                }}>
                    {/* Header Section */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        marginBottom: '4rem',
                    }} className="fade-in-animation">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '2rem',
                        }}>
                            <div>
                                <h1 style={{
                                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                                    fontWeight: '600',
                                    color: 'white',
                                    lineHeight: '1.2',
                                    fontFamily: 'Outfit, system-ui, sans-serif',
                                    margin: 0,
                                }}>
                                    Learn from the Best Talent <br />
                                    in the Industry
                                </h1>
                            </div>

                            {/* View All Button */}
                            <button
                                className="button-hover"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: '100px',
                                    padding: '1rem 1.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontFamily: 'Outfit, system-ui, sans-serif',
                                }}
                            >
                                <span style={{
                                    color: '#011813',
                                    fontWeight: '500',
                                    marginRight: '1rem',
                                    fontSize: '1rem',
                                }}>
                                    View All Mentors
                                </span>
                                <div
                                    className="button-icon-hover"
                                    style={{
                                        width: '2.75rem',
                                        height: '2.75rem',
                                        backgroundColor: '#011813',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                >
                                    <svg
                                        style={{
                                            width: '1.25rem',
                                            height: '1.25rem',
                                            color: 'white',
                                        }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Mentors Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}>
                        {mentors.map((mentor, index) => (
                            <div
                                key={index}
                                className={`hover-scale fade-up-animation`}
                                style={{
                                    backgroundColor: mentor.bgColor,
                                    borderRadius: '50px',
                                    height: '500px',
                                    width: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease',
                                    marginTop: mentor.offset ? '5rem' : '0',
                                    animationDelay: `${index * 0.2}s`,
                                }}
                            >
                                {/* Mentor Info */}
                                <div style={{
                                    position: 'absolute',
                                    top: '3.5rem',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    textAlign: 'center',
                                    zIndex: 10,
                                    width: '90%',
                                }}>
                                    <h3 style={{
                                        color: '#011813',
                                        fontSize: '1.5rem',
                                        fontWeight: '500',
                                        margin: '0 0 0.5rem 0',
                                        fontFamily: 'Outfit, system-ui, sans-serif',
                                    }}>
                                        {mentor.name}
                                    </h3>
                                    <p style={{
                                        color: '#4e5255',
                                        fontSize: '1rem',
                                        margin: 0,
                                        fontFamily: 'Outfit, system-ui, sans-serif',
                                    }}>
                                        {mentor.role}
                                    </p>
                                </div>

                                {/* Mentor Image */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '100%',
                                    height: '368px',
                                }}>
                                    <img
                                        src={mentor.image}
                                        alt={mentor.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'top center',
                                        }}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&size=300&background=random&color=fff`;
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
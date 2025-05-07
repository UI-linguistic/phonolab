import React, { useState, useEffect } from 'react';

// Component to display each vowel's information
function VowelCell({ vowel }) {
    return (
        <div className="vowel-cell">
            <div className="vowel-info">
                <span className="ipa">{vowel.ipa}</span>
                <audio controls>
                    <source src={vowel.audio_url[0]} type="audio/mp3" />
                    Your browser does not support the audio tag.
                </audio>
            </div>
            <div className="vowel-images">
                {vowel.lip_image_url && <img src={vowel.lip_image_url} alt="Lip shape" />}
                {vowel.tongue_image_url && <img src={vowel.tongue_image_url} alt="Tongue position" />}
            </div>
        </div>
    );
}

// Component to display a section (like 'Lip Shape' or 'Length')
function Vowel101Section({ sectionData }) {
    return (
        <div className="vowel-section">
            <h2>{sectionData.name}</h2>
            <div className="vowel-grid">
                {sectionData.cells.map((cell) => (
                    <div key={cell.id} className="vowel-cell-wrapper" style={{ gridRow: cell.row, gridColumn: cell.col }}>
                        {cell.vowels.map((vowel) => (
                            <VowelCell key={vowel.id} vowel={vowel} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}


function Vowel101Lesson() {
    const [sectionData, setSectionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState(1);  // Default to the first section

    const API_BASE_URL = 'http://127.0.0.1:5001/api'; // ENDPOINT

    // Section names for display in buttons
    const sectionNames = {
        1: "Tongue Position",
        2: "Lip Rounding",
        3: "Vowel Length"
    };

    // Fetch a specific section by ID
    const fetchVowelSection = (sectionId) => {
        setLoading(true);
        setActiveSection(sectionId);

        fetch(`${API_BASE_URL}/lessons/vowels-101/${sectionId}`) // ENDPOINT
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setSectionData(data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching section data:', error);
                setLoading(false);
            });
    };

    // Load the first section by default when component mounts
    useEffect(() => {
        fetchVowelSection(1);
    }, []);

    return (
        <div className="vowel101-lesson">
            <div className="section-navigation">
                <h1>Vowels 101</h1>
                <div className="section-buttons">
                    {[1, 2, 3].map(sectionId => (
                        <button
                            key={sectionId}
                            onClick={() => fetchVowelSection(sectionId)}
                            className={activeSection === sectionId ? 'active' : ''}
                        >
                            {sectionNames[sectionId]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="section-content">
                {loading ? (
                    <div className="loading-indicator">
                        <p>Loading section data...</p>
                    </div>
                ) : (
                    sectionData && <Vowel101Section sectionData={sectionData} />
                )}
            </div>
        </div>
    );
}

export default Vowel101Lesson;


// sample stlyling css

/* Add hover effect on the vowel cell */
// .vowel-cell-wrapper:hover {
//     background-color: #f0f0f0;
//     transform: scale(1.1); /* Slightly enlarge the vowel for emphasis */
//     transition: transform 0.2s ease, background-color 0.2s ease;
//   }
  
//   /* Optional: Highlight the IPA when hovered */
//   .vowel-cell-wrapper .ipa:hover {
//     color: #ff5733;  /* Change color on hover */
//     cursor: pointer;
//   }
  
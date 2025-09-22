import React from 'react';

const BestTalents = () => {
  const talents = [
    {
      id: 1,
      name: "Matthew Ryan",
      role: "Product Designer",
      image: "/bestTalent/Mathew.png",
      backgroundColor: "#FFD3E1",
    },
    {
      id: 2,
      name: "Daniel Joseph",
      role: "Software Engineer",
      image: "/bestTalent/Daniel.png",
      backgroundColor: "#FFD3E1",
    },
    {
      id: 3,
      name: "Adam Bennett",
      role: "Digital Marketer",
      image: "/bestTalent/Adam.png",
      backgroundColor: "#FBECC0",
    },
    {
      id: 4,
      name: "James Michael",
      role: "Digital Marketer",
      image: "/bestTalent/James.png",
      backgroundColor: "#FCEEDF",
    }
  ];

  return (
    <section style={{ backgroundColor: "#011813" }} className="py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center m-10">
          <h2 className="text-white text-3xl font-semibold mb-4 pl-8 md:mb-0">
            Learn from the Best Talent<br />in the Industry
          </h2>
            <div className='flex justify-center md:justify-start'>
          <button className="bg-white rounded-full py-3 px-6 text-[#011813] font-medium inline-flex items-center hover:text-green-500 transition">
            <span>View All Mentors</span>
           <div className="w-8 h-8 bg-[#011813] rounded-full ml-2 flex items-center justify-center">
              <img src="/bestTalent/arrowicon.png" alt="Arrow Right" className="w-8 h-8" />
            </div>
          </button>
        </div>
        </div>

        {/* Staggered Talents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {talents.map((talent) => (
            <div key={talent.id} className={`flex justify-center ${(talent.id === 2 || talent.id === 4) ? 'lg:transform lg:translate-y-12' : ''}`}>
              <div 
                style={{ backgroundColor: talent.backgroundColor }}
                className="rounded-full  w-auto h-auto max-w-xs overflow-hidden"
              >
                <div className="text-center mb-10 mt-4 pt-4">
                  <h3 className="text-xl font-medium text-[#011813]">{talent.name}</h3>
                  <p className="text-[#4E5255]">{talent.role}</p>
                </div>
                <div className="h-auto overflow-hidden ">
                  <img 
                    src={talent.image} 
                    alt={talent.name}
                    className="object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image: ${talent.image}`);
                      e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestTalents;
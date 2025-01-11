import React from 'react';
import { GithubIcon, LinkedinIcon } from 'lucide-react';
import Header from "../Header/Header";

const TeamMemberCard = ({ name, role, description, linkedin, github, imgSrc }) => (
  <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
    <div className="flex flex-col items-center mb-4">
      <img
        src={imgSrc}
        alt={name}
        className="w-32 h-32 rounded-full mb-4 object-cover"
      />
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="text-blue-400 mb-2">{role}</p>
    </div>
    <p className="text-gray-300 mb-4 text-center">{description}</p>
    <div className="flex justify-center space-x-4">
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 transition-colors"
      >
        <LinkedinIcon size={24} />
      </a>
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-gray-300 transition-colors"
      >
        <GithubIcon size={24} />
      </a>
    </div>
  </div>
);

const ContactUs = () => {
  const teamMembers = [
    {
      name: "Dhanvanth Voona",
      role: "GenAI Engineer",
      description: "Dhanvanth is the creator of Text2Block, who is currently working as an AI Engineer Intern at Liminal XR Solutions. He specializes in Prompt Engineering, Large Language Models (LLMs), Generative AI applications, Data Analysis, Business Intelligence, and Computer Vision. He is pursuing a Master's degree in Data Science at the Illinois Institute of Technology, Chicago.",
      linkedin: "https://www.linkedin.com/in/dv-63192b18b/",
      github: "https://github.com/dhanvanth342",
      imgSrc: "/team/dhanvanth.jpg"
    },
    {
      name: "Saikiran Somanagoudar",
      role: "Software Engineer",
      description: "Saikiran, with 4+ years in software, contributed to the development of Text2Block. He is currently pursuing a Master's degree in Computer Science at the Illinois Institute of Technology, Chicago.",
      linkedin: "https://www.linkedin.com/in/saikiransomanagoudar/",
      github: "https://github.com/saikiransomanagoudar",
      imgSrc: "/team/saikiran.jpg"
    }
  ];

  return (
    <div className="min-h-screen px-4">
      <Header />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Our Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
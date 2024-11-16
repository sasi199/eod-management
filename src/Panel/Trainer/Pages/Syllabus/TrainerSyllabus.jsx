import React, { useState } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiJquery, SiJavascript } from 'react-icons/si';

const TrainerSyllabus = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const handleDownloadPDF = () => {
    const syllabusElement = document.getElementById('syllabus-content');
    html2canvas(syllabusElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Full-Stack-Web-Development-Roadmap.pdf');
    });
  };

  const topics = [
    {
      name: 'HTML',
      icon: <FaHtml5 className="text-red-600" />,
      syllabus: 'Basics of HTML, Elements, Attributes, Forms, Semantic HTML',
    },
    {
      name: 'CSS',
      icon: <FaCss3Alt className="text-blue-600" />,
      syllabus: 'CSS Syntax, Flexbox, Grid, Responsive Design, Animations',
    },
    {
      name: 'JavaScript',
      icon: <FaJs className="text-yellow-500" />,
      syllabus: 'Variables, Functions, DOM Manipulation, Event Handling, ES6+',
    },
    {
      name: 'ES6',
      icon: <SiJavascript className="text-green-600" />,
      syllabus: 'Arrow Functions, Destructuring, Spread and Rest Operators, Promises',
    },
    {
      name: 'jQuery',
      icon: <SiJquery className="text-blue-400" />,
      syllabus: 'DOM Manipulation, Event Handling, AJAX with jQuery',
    },
    {
      name: 'ReactJS',
      icon: <FaReact className="text-blue-500" />,
      syllabus: 'Components, Props, State, Hooks, Routing, Context API',
    },
    {
      name: 'NodeJS',
      icon: <FaNodeJs className="text-green-600" />,
      syllabus: 'Server-side JavaScript, Express.js, REST APIs, Middleware',
    },
  ];

  const toggleExpand = (index) => {
    setExpandedTopic(expandedTopic === index ? null : index);
  };

  return (
    <div className="px-2 bg-gray-100 min-h-screen">
      <div className='flex items-center justify-between px-3 mb-4'>
      <h1 className="text-2xl font-semibold text-center text-orange-500  ">
        Full-Stack Web Development Roadmap
      </h1>
      <button
        onClick={handleDownloadPDF}
        className=" px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
      >
        Download Syllabus
      </button>
      </div>
      <div id="syllabus-content" className="bg-white p-8 rounded-lg shadow-md">
     
        <div className="space-y-6">
          {topics.map((topic, index) => (
            <div key={index} className="border-l-4 border-primary pl-4">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <div className="text-3xl">{topic.icon}</div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {topic.name}
                </h2>
              </div>
              {expandedTopic === index && (
                <div className="mt-2 pl-10 pr-4 py-3 bg-gray-50 rounded-lg shadow-inner">
                  <p className="text-gray-600">{topic.syllabus}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    
    </div>
  );
};

export default TrainerSyllabus;

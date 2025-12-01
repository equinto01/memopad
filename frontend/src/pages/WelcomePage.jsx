import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRightIcon, CodeIcon, DatabaseIcon, ServerIcon, GlobeIcon, SparklesIcon } from "lucide-react";

const WelcomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const techStack = [
    { name: "MongoDB", icon: DatabaseIcon, color: "text-green-400", delay: "delay-0" },
    { name: "Express", icon: ServerIcon, color: "text-gray-300", delay: "delay-75" },
    { name: "React", icon: CodeIcon, color: "text-blue-400", delay: "delay-150" },
    { name: "Node.js", icon: GlobeIcon, color: "text-green-500", delay: "delay-300" },
  ];

  const crudFeatures = [
    { action: "Create", desc: "Add new notes to your collection", icon: "➕" },
    { action: "Read", desc: "View and browse all your notes", icon: "👁️" },
    { action: "Update", desc: "Edit existing notes anytime", icon: "✏️" },
    { action: "Delete", desc: "Remove notes you no longer need", icon: "🗑️" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Smooth flowing background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-pastel-blue/20 via-pastel-purple/15 to-pastel-pink/20 animate-flow-background" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/20 animate-float"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block mb-6">
            <SparklesIcon className="size-16 text-primary animate-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-primary animate-gradient">
            MemoPad
          </h1>
          
          <p className="text-xl md:text-2xl text-base-content/80 mb-4 font-light">
            A Personal MERN Stack Learning Project
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-pastel-blue to-pastel-purple mx-auto mb-8" />
          
          <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
            This website was created for <span className="font-semibold text-primary">personal use</span> to explore and understand how the{" "}
            <span className="font-semibold text-secondary">MERN stack</span> works in practice. 
            Experience full <span className="font-semibold text-accent">CRUD operations</span> while building a real-world note-taking application.
          </p>

          <Link
            to="/notes"
            className="btn btn-lg group mt-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-primary hover:bg-primary/80 text-base-100 border-0"
          >
            <span>Explore Notes</span>
            <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-base-content">
            Built With <span className="text-primary">MERN</span> Stack
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              const borderClasses = [
                'border-primary/30 hover:border-primary/50 hover:shadow-primary/20',
                'border-secondary/30 hover:border-secondary/50 hover:shadow-secondary/20',
                'border-accent/30 hover:border-accent/50 hover:shadow-accent/20',
                'border-primary/30 hover:border-primary/50 hover:shadow-primary/20',
              ];
              const gradientClasses = [
                'from-primary/10',
                'from-secondary/10',
                'from-accent/10',
                'from-primary/10',
              ];
              return (
                <div
                  key={tech.name}
                  className={`group relative p-6 rounded-lg bg-base-200 border-2 ${borderClasses[index % borderClasses.length]} transition-all duration-500 transform hover:scale-110 hover:shadow-xl ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  } ${tech.delay}`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[index % gradientClasses.length]} to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10 text-center text-base-content">
                    <Icon className={`size-12 mx-auto mb-4 ${tech.color} group-hover:scale-125 transition-transform duration-300`} />
                    <h3 className="font-semibold text-lg">{tech.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CRUD Operations Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-4 text-base-content">
            Understanding <span className="text-primary">CRUD</span> Operations
          </h2>
          <p className="text-center text-base-content/70 mb-12 text-lg">
            The core purpose of this project is to demonstrate how Create, Read, Update, and Delete operations work
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {crudFeatures.map((feature, index) => {
              const borderClasses = [
                'border-primary/30 hover:border-primary/50 hover:shadow-primary/20',
                'border-secondary/30 hover:border-secondary/50 hover:shadow-secondary/20',
                'border-accent/30 hover:border-accent/50 hover:shadow-accent/20',
                'border-primary/30 hover:border-primary/50 hover:shadow-primary/20',
              ];
              const glowClasses = [
                'bg-primary/0 group-hover:bg-primary/10',
                'bg-secondary/0 group-hover:bg-secondary/10',
                'bg-accent/0 group-hover:bg-accent/10',
                'bg-primary/0 group-hover:bg-primary/10',
              ];
              return (
                <div
                  key={feature.action}
                  className={`group relative p-6 rounded-lg bg-base-200 border-2 ${borderClasses[index % borderClasses.length]} transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    transitionDelay: `${(index + 4) * 100}ms`,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="text-4xl mb-4 text-center group-hover:scale-125 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-base-content">
                    {feature.action}
                  </h3>
                  <p className="text-center text-base-content/70 text-sm">
                    {feature.desc}
                  </p>
                  
                  {/* Hover effect glow */}
                  <div className={`absolute inset-0 rounded-lg ${glowClasses[index % glowClasses.length]} transition-colors duration-500 -z-10`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Purpose Statement */}
        <div
          className={`max-w-4xl mx-auto text-center p-8 md:p-12 rounded-lg bg-base-200 border-2 border-primary/30 shadow-2xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ 
            transitionDelay: "800ms",
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-base-content">
            Why This Project Exists
          </h2>
          <p className="text-lg md:text-xl text-base-content/80 leading-relaxed">
            MemoPad serves as a hands-on learning experience to understand the fundamentals of the MERN stack and CRUD operations. 
            Through building this application, I've explored how frontend and backend communicate, how databases store and retrieve data, 
            and how RESTful APIs enable seamless user interactions. This project represents a practical approach to learning web development 
            by creating something useful while mastering essential full-stack concepts.
          </p>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link
            to="/notes"
            className="btn btn-lg group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-primary hover:bg-primary/80 text-base-100 border-0"
          >
            <span>Start Exploring</span>
            <ArrowRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;


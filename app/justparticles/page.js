"use client"
import ParticlesComponent from "components/particle";

export default function JustParticles(){

    return(
        <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticlesComponent id="particles" />
      </div>
    );
}
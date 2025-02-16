var timeline1 = gsap.timeline()
var timeline2 = gsap.timeline()

timeline1.from(".navani", {
    y: -30,
    duration: 0.5,
    opacity: 0,
    delay: 0.2,
    stagger: 0.3
})

gsap.from(".profilepic", {
    y: 500,
    scale:0,
    duration:0.8,
    opacity: 0,
    delay:0.2,

})

timeline2.from(".pfani1", {
    scale:0,
    duration:1,
    opacity: 0,
    delay:0.5,
    stagger:0.2

})

const buttons = document.querySelectorAll(".navani")

buttons.forEach(button => {
    button.addEventListener("mouseenter", () => {
        gsap.to(button, {
            scale: 1.2,
            duration: 0.3
        });
    });
    
    button.addEventListener("mouseleave", () => {
        gsap.to(button, {
            scale: 1,
        });
    });
});


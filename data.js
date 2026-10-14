/* DATOS: aspectos, preguntas, textos de resultados. Editar aquí no requiere tocar la lógica. */
const ASPECTS = [
  {id:"animo",   name:"Estado de ánimo", icon:"😊", color:"var(--y)"},
  {id:"energia", name:"Energía",         icon:"⚡", color:"var(--g)"},
  {id:"sueno",   name:"Sueño",           icon:"🌙", color:"var(--b)"},
  {id:"familia", name:"Familia",         icon:"👨‍👩‍👧", color:"var(--p)"},
  {id:"colegio", name:"Colegio",         icon:"📚", color:"var(--o)"}
];
/* Cada pregunta tiene 3 opciones; su posición (0, 1, 2) es el puntaje. */
const QUESTIONS = {
  animo:[
    {t:"Últimamente, cuando llegas a casa después del colegio…", o:["Me siento bien y puedo disfrutar mi tiempo","A veces me siento desanimado/a","Casi siempre me siento triste o sin ganas de hacer nada"]},
    {t:"Las cosas que antes disfrutabas, ¿las sigues disfrutando?", o:["Sí, las sigo disfrutando","Algunas ya no me emocionan tanto","Casi nada me emociona"]},
    {t:"¿Te has sentido mal contigo mismo/a o como si hubieras decepcionado a otros?", o:["Casi nunca","Algunos días","Casi todos los días"]},
    {t:"¿Sientes que tus emociones actuales interfieren negativamente en tu rendimiento escolar o en tus relaciones personales?", o:["No, casi nunca","Algunos días","Sí, casi todos los días"]}
  ],
  energia:[
    {t:"¿Cómo está tu energía durante el día?", o:["Tengo energía para mis actividades","Me siento cansado/a algunos días","Casi siempre me siento agotado/a"]},
    {t:"Empezar o terminar tus tareas se siente…", o:["Normal","Difícil algunos días","Un esfuerzo enorme casi siempre"]},
    {t:"¿Has notado cambios en tu apetito?", o:["No, está estable","Algunos días","Casi todos los días"]}
  ],
  sueno:[
    {t:"¿Cómo duermes últimamente?", o:["Duermo bien","A veces me cuesta dormir","Casi todas las noches me cuesta dormir o duermo demasiado"]},
    {t:"Al despertar, ¿te sientes descansado/a?", o:["Casi siempre","A veces","Casi nunca"]},
    {t:"¿Te cuesta concentrarte en clase por el sueño o el cansancio?", o:["Casi nunca","Algunos días","Casi todos los días"]}
  ],
  familia:[
    {t:"¿Cómo te sientes en casa con tu familia?", o:["Acompañado/a y tranquilo/a","A veces siento distancia o tensión","Me siento solo/a o incomprendido/a casi siempre"]},
    {t:"Cuando algo te preocupa, ¿puedes hablarlo con alguien de tu familia?", o:["Sí","Depende","No, prefiero guardármelo"]},
    {t:"¿Te dan ganas de alejarte de tu familia o de tus amigos?", o:["Casi nunca","Algunos días","Casi todos los días"]}
  ],
  colegio:[
    {t:"¿Cómo te sientes en el colegio?", o:["Cómodo/a","Con estrés algunos días","Con mucha presión o ganas de no ir"]},
    {t:"En clase, ¿te cuesta concentrarte o mantener la atención?", o:["Casi nunca","Algunos días","Casi todos los días"]},
    {t:"¿Sientes que tienes con quién contar en el colegio?", o:["Sí, con varias personas","Con una persona o a veces","Siento que no tengo a nadie"]}
  ]
};
const FACES = ["😊","😐","😔"];
const LEVEL_LABEL = ["Vas bien","Para observar","Importante atender"];
const RESULTS = {
  0:{icon:"💚", title:"Vas por buen camino", text:"Tus respuestas no muestran señales fuertes por ahora. Seguir conociéndote y cuidando tus hábitos te ayuda a mantenerte bien."},
  1:{icon:"💛", title:"Hay algunas señales que sería bueno observar", text:"Tus respuestas muestran algunas señales a las que conviene prestar atención. No significa que tengas depresión, pero es importante que estés atento/a a cómo te sientes."},
  2:{icon:"🧡", title:"Tus respuestas muestran varias señales importantes", text:"No significa que tengas depresión (solo un profesional puede evaluarlo), pero es importante que hables pronto con alguien de confianza o con orientación escolar. No tienes que pasar por esto solo/a."}
};
const TIPS = {
  animo:"Escribe lo que sientes o cuéntaselo a alguien: ponerlo en palabras alivia.",
  energia:"Camina 15 minutos al día, come a tus horas y divide las tareas grandes en pasos pequeños.",
  sueno:"Acuéstate y levántate a horas regulares, evita pantallas la hora previa a dormir y reduce la cafeína en la tarde.",
  familia:"Busca un momento tranquilo para hablar con alguien de casa; si no es posible, apóyate en otro adulto de confianza.",
  colegio:"Habla con tu director/a de curso u orientación escolar sobre la presión que sientes."
};

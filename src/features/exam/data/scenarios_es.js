/**
 * Client-facing Examination Matrix — Spanish (ES)
 * IDs e índices de opciones están alineados con scenarios_en.js.
 */
export const EXAM_SCENARIO_MATRIX_ES = [
  { id: 1, tier: "Level 01", category: "Transparencia", scenarioText: "Un empleado municipal recibe un informe de políticas generado por IA que resume normas de zonificación propuestas. No indica que fue sintetizado por una máquina y debe circularse a cargos electos en una hora. Conforme a las obligaciones de alfabetización en IA del Article 4, ¿qué actuación cumple el estándar mínimo de supervisión humana transparente antes de su difusión institucional?", options: [
    "Revelar el uso de IA generativa, verificar cada referencia normativa citada con fuentes legislativas primarias y documentar la revisión humana antes de distribuirlo.",
    "Circular el informe inmediatamente, pues la redacción asistida por IA se presume conforme si los estatutos fuente son públicos.",
    "Añadir una advertencia genérica de que el documento puede contener errores, sin especificar la intervención de IA ni realizar una verificación sustantiva.",
    "Aplazar indefinidamente la difusión hasta que concluya una auditoría jurídica independiente del corpus de entrenamiento del proveedor."
  ]},
  { id: 2, tier: "Level 01", category: "Supervisión humana", scenarioText: "Una coordinadora de RR. HH. utiliza una herramienta de selección de currículos que asigna puntuaciones automáticas de rechazo. Una candidata solicita una explicación de su descalificación. La coordinadora no ha recibido formación sobre la lógica de decisión. ¿Qué respuesta se ajusta al principio de supervisión humana exigido por la alfabetización en IA del EU AI Act?", options: [
    "Informar a la candidata de que las decisiones algorítmicas son propietarias y no divulgables conforme a la confidencialidad del proveedor.",
    "Escalar la consulta a un revisor humano cualificado, iniciar una reevaluación manual documentada y registrar la intervención de supervisión en la pista de auditoría institucional.",
    "Volver a ejecutar el perfil de la candidata para confirmar la puntuación de rechazo, considerando que un resultado idéntico es explicación suficiente.",
    "Aconsejarle que vuelva a solicitarlo usando formatos que se sabe producen puntuaciones favorables en el proceso automatizado."
  ]},
  { id: 3, tier: "Level 01", category: "Privacidad de datos", scenarioText: "A una asistente administrativa sanitaria un chatbot comercial le pide pegar el código de diagnóstico y la fecha de nacimiento de un paciente para «generar una carta de contacto compasiva». Trabaja en una clínica de un Estado miembro de la UE sujeta al GDPR. ¿Cuál es el tratamiento conforme?", options: [
    "Pegar los identificadores mínimos necesarios, ya que la política del chatbot afirma que no conserva datos después de la sesión.",
    "Anonimizar solo el apellido del paciente y conservar el código diagnóstico y la fecha de nacimiento, considerando suficiente una redacción parcial.",
    "Negarse a introducir datos sanitarios identificables en un sistema externo no aprobado; utilizar un flujo autorizado institucionalmente y conforme al GDPR con base jurídica documentada.",
    "Solicitar consentimiento verbal por teléfono antes de pegar los datos, sin evaluar el acuerdo con el encargado ni el impacto de la transferencia."
  ]},
  { id: 4, tier: "Level 01", category: "Alfabetización fundamental", scenarioText: "En un taller interno, una colega afirma que «los modelos lingüísticos grandes poseen conocimiento autorizado del derecho vigente porque fueron entrenados con corpus jurídicos». Como candidata certificada en alfabetización de IA, ¿qué corrección refleja mejor los límites epistémicos de los sistemas generativos conforme a estándares profesionales?", options: [
    "Los modelos entrenados con corpus jurídicos son jurídicamente vinculantes cuando su puntuación de confianza supera el noventa por ciento.",
    "Los sistemas generativos no son aptos para ningún uso profesional y deben prohibirse categóricamente en instituciones reguladas.",
    "La exactitud jurídica está garantizada cuando el proveedor publica una certificación SOC 2 Type II.",
    "Los modelos lingüísticos grandes reproducen patrones probabilísticos de sus datos de entrenamiento y pueden producir afirmaciones jurídicas plausibles pero incorrectas o desactualizadas; es obligatoria la verificación humana con fuentes autorizadas."
  ]},
  { id: 5, tier: "Level 01", category: "Responsabilidad del usuario", scenarioText: "Un analista financiero emplea un asistente generativo para redactar una nota de inversión con proyecciones prospectivas de rendimiento. Pretende presentarla bajo sus propias credenciales profesionales. ¿Qué conducta satisface la doctrina de responsabilidad del usuario de la alfabetización en IA del Article 4?", options: [
    "Validar independientemente todas las afirmaciones cuantitativas, asumir responsabilidad personal por el contenido final y conservar evidencia de la revisión humana y de correcciones materiales.",
    "Presentar la nota tal como fue redactada, siempre que la herramienta de IA figure en una nota al pie como «ayuda de investigación».",
    "Transferir la responsabilidad al proveedor de IA mediante el contrato de licencia, que indemniza a usuarios finales por errores de contenido.",
    "Limitar la revisión a ortografía y formato, pues los sistemas generativos están exentos de normas de divulgación de valores."
  ]},
  { id: 6, tier: "Level 01", category: "Reconocimiento de riesgos", scenarioText: "Un empleado recibe una llamada de voz que aparentemente procede del director financiero de la institución e instruye una transferencia urgente. La voz es muy convincente y menciona proyectos internos. Después descubre que se usó una herramienta generativa de clonación de voz. ¿Qué medida preventiva refleja el reconocimiento cotidiano del riesgo de fraude habilitado por IA?", options: [
    "Confiar solo en biometría vocal, pues el audio sintético no puede reproducir de forma convincente patrones de voz ejecutivos.",
    "Implantar protocolos de verificación fuera de banda para instrucciones financieras, formar al personal sobre ingeniería social mediante deepfakes y tratar la suplantación aumentada por IA como amenaza operativa permanente.",
    "Desactivar toda comunicación telefónica en favor del correo electrónico, que no puede ser falsificado por sistemas de IA.",
    "Autorizar transferencias inferiores a un umbral sin verificación para preservar la velocidad operativa."
  ]},
  { id: 7, tier: "Level 01", category: "Consentimiento informado", scenarioText: "Una oficina universitaria de orientación utiliza un agente conversacional para clasificar derivaciones de salud mental. No se informa a estudiantes de que sus respuestas son procesadas por un intermediario de IA antes de la revisión de un orientador humano. ¿Qué corrección cumple las obligaciones de consentimiento informado y transparencia?", options: [
    "Publicar la divulgación de IA en la página web anual de aviso de privacidad sin modificar la interfaz de clasificación.",
    "Asumir consentimiento implícito porque los estudiantes accedieron voluntariamente al portal de orientación.",
    "Ofrecer una divulgación clara y oportuna de que un sistema de IA participa en la clasificación, describir el uso de datos y las vías de revisión humana, y obtener reconocimiento afirmativo antes de recopilar respuestas sensibles.",
    "Eliminar silenciosamente el componente de IA conservando los registros históricos de interacción sin avisar a estudiantes afectados."
  ]},
  { id: 8, tier: "Level 01", category: "Verificación de resultados", scenarioText: "Un responsable de compras pide a un modelo generativo resumir tres cláusulas contractuales de proveedores sobre límites de responsabilidad. El modelo devuelve citas seguras con numeración de cláusulas inexistente en los PDF fuente. ¿Qué protocolo satisface los estándares básicos de alfabetización en IA?", options: [
    "Aceptar el resumen si las partes interesadas internas coinciden en que refleja la intención negociada, con independencia de la exactitud de las citas.",
    "Pedir al modelo que regenere el resumen hasta que la numeración coincida, considerando la coherencia entre iteraciones como validación.",
    "Externalizar la verificación al proveedor, puesto que sus documentos son responsabilidad suya de interpretar.",
    "Contrastar cada cláusula citada con el texto contractual autorizado, señalar las citas alucinadas y prohibir depender de resultados no verificados para decisiones vinculantes."
  ]},
  { id: 9, tier: "Level 01", category: "Conciencia de sesgos", scenarioText: "Una herramienta de planificación con IA asigna sistemáticamente turnos nocturnos a empleados cuyos apellidos se correlacionan con grupos de origen étnico determinados en la región de entrenamiento. Los supervisores observan el patrón, pero lo atribuyen a una «optimización aleatoria». ¿Qué acción refleja el reconocimiento conforme de sesgos bajo las expectativas de alfabetización del Article 4?", options: [
    "Suspender la planificación automatizada pendiente de evaluación de impacto, notificar a las partes de gobernanza e iniciar medidas correctivas, incluidas pruebas de sesgo y conciliación humana de asignaciones.",
    "Seguir usando la herramienta salvo que se presente una denuncia formal por discriminación.",
    "Ajustar la configuración de visualización para que los patrones de turnos sean menos visibles a responsables de primera línea.",
    "Sustituir la herramienta por un producto idéntico de otro proveedor sin examinar los datos ni el comportamiento del modelo."
  ]},
  { id: 10, tier: "Level 01", category: "Reconocimiento cotidiano de riesgos", scenarioText: "Un miembro del personal carga un plan estratégico interno en un sitio público gratuito de IA generativa para «mejorar la redacción». El documento contiene hojas de ruta de productos no divulgadas y precios de socios. ¿Qué respuesta inmediata satisface los protocolos cotidianos de riesgo de exfiltración de datos?", options: [
    "No se requiere acción si la sesión se eliminó después de copiar localmente la mejora de redacción.",
    "Notificar el incidente por el canal institucional de seguridad de datos, iniciar procedimientos de evaluación de brecha, revocar el uso ulterior de herramientas no aprobadas y documentar medidas correctoras, incluido el registro de auditoría elegible para WaqfLedger cuando corresponda.",
    "Cambiar los nombres de usuario en la plataforma de IA para impedir atribuir la carga.",
    "Emitir una nota a todo el departamento desaconsejando cargas sin notificar a seguridad de la información ni evaluar el impacto de confidencialidad contractual."
  ]},
  { id: 11, tier: "Level 02", category: "Riesgo de contratación", scenarioText: "El director de información de una institución propone adoptar una suite empresarial de IA generativa mediante contratación de fuente única por «urgencia de mercado». El proveedor se niega a revelar frecuencia de actualizaciones, procedencia de datos de entrenamiento o subencargados. Conforme a la diligencia debida del EU AI Act, ¿qué postura de contratación es conforme?", options: [
    "Proceder con la adjudicación de fuente única para evitar retrasos competitivos, condicionando el cumplimiento a compromisos públicos de marketing del proveedor.",
    "Delegar la aprobación de contratación al equipo de éxito de clientes del proveedor, que certifica una alineación de mejor esfuerzo con marcos regulatorios no especificados.",
    "Detener la adjudicación hasta negociar y revisar jurídicamente anexos contractuales de transparencia de IA, registros de subencargados, cláusulas de notificación de cambios de modelo y documentación de conformidad.",
    "Licenciar la herramienta solo para una cohorte piloto, eliminando así obligaciones de gobernanza empresarial."
  ]},
  { id: 12, tier: "Level 02", category: "Diligencia debida del proveedor", scenarioText: "Un proveedor propuesto de analítica de IA ofrece un vistoso folleto «Ética y seguridad», pero no documentación técnica, clasificación de riesgos ni declaración UE de conformidad para módulos comercializados como apoyo a «decisiones de alto impacto». ¿Qué estándar de diligencia debe exigir el consejo de gobernanza antes del despliegue?", options: [
    "Aceptar el folleto como evidencia suficiente de alineación ética si se acompaña de un contrato plurianual con descuento.",
    "Basarse en decisiones de adopción de instituciones pares como certificación implícita de idoneidad del proveedor.",
    "Limitar el despliegue a jurisdicciones no pertenecientes a la UE para evitar por completo requisitos documentales.",
    "Exigir documentación técnica verificable, declaraciones de finalidad prevista, limitaciones conocidas, clasificación de nivel de riesgo aplicable y validación independiente de afirmaciones relevantes para casos de uso regulados."
  ]},
  { id: 13, tier: "Level 02", category: "Divulgación del modelo", scenarioText: "Un proveedor de modelo fundacional actualiza sus condiciones de API para permitir uso irrestricto de prompts de usuarios para entrenamiento futuro, salvo que clientes empresariales se excluyan en treinta días. La institución procesa investigación confidencial mediante la API bajo contratos existentes silenciosos sobre reutilización para entrenamiento. ¿Qué acción ejecutiva satisface las obligaciones de divulgación del modelo y gobernanza de datos?", options: [
    "Realizar una revisión contractual urgente, ejercer derechos de exclusión o migración, informar a responsables del tratamiento afectados y modificar la política institucional de uso aceptable de IA para reflejar riesgos de reutilización de datos de entrenamiento.",
    "Continuar el uso bajo condiciones heredadas, afirmando que el silencio implica confidencialidad perpetua.",
    "Indicar a investigadores que parafraseen prompts para imposibilitar la captura literal para entrenamiento.",
    "Aceptar las nuevas condiciones porque los proveedores del sector reservan uniformemente derechos de entrenamiento."
  ]},
  { id: 14, tier: "Level 02", category: "Red teaming", scenarioText: "Antes de desplegar al personal un asistente ajustado institucionalmente, el comité de gobernanza debe autorizar un protocolo de red teaming. ¿Qué alcance de pruebas adversariales satisface las expectativas ejecutivas para sistemas generativos que manejan bases de conocimiento internas?", options: [
    "Ejecutar solo corrector ortográfico automatizado y pruebas de latencia, pues los modelos generativos son estocásticos y las pruebas adversariales no son concluyentes.",
    "Encargar red teaming estructurado que cubra inyección de prompts, exfiltración de datos, escalada de privilegios, resultados dañinos e intentos de jailbreak, con corrección documentada de hallazgos materiales antes de producción.",
    "Limitar las pruebas a la tarjeta de seguridad publicada por el proveedor sin escenarios de ataque específicos de la institución.",
    "Aplazar el red teaming hasta después del despliegue completo para captar orgánicamente fallos del mundo real."
  ]},
  { id: 15, tier: "Level 02", category: "Responsabilidad institucional", scenarioText: "Una universidad que licencia una IA de detección de plagio de terceros asigna calificaciones suspensas basándose exclusivamente en el índice de similitud, sin revisión académica humana. Estudiantes recurren alegando falsos positivos en trabajo colaborativo correctamente citado. ¿Qué decisión aborda correctamente la responsabilidad institucional?", options: [
    "Defender las calificaciones porque el algoritmo del proveedor es estándar del sector y, por tanto, presuntamente fiable.",
    "Indemnizar a la institución mediante el contrato del proveedor y continuar la calificación automatizada a escala.",
    "Exigir revisión académica humana con intervención en todas las acciones adversas, suspender la dependencia exclusiva de puntuaciones automatizadas y revisar la política para asignar a la institución responsabilidad por determinaciones finales.",
    "Trasladar la responsabilidad a estudiantes obligándolos a aceptar la detección de IA en acuerdos de matrícula."
  ]},
  { id: 16, tier: "Level 02", category: "Cumplimiento contractual", scenarioText: "El asesor jurídico revisa un acuerdo marco de un proveedor de IA con una amplia cláusula de limitación de responsabilidad que limita daños a doce meses de tarifas, mientras el sistema apoya recomendaciones de solvencia que afectan a consumidores de la UE. ¿Qué postura contractual se alinea con gobernanza ejecutiva y prudencia de responsabilidad institucional?", options: [
    "Aceptar el límite incondicionalmente para acelerar indicadores de transformación digital.",
    "Eliminar todos los límites de responsabilidad borrando la cláusula sin instrumentos sustitutivos.",
    "Transferir el acuerdo a una filial pantalla para aislar la exposición institucional.",
    "Negociar exclusiones para multas regulatorias, indemnizaciones por brechas de datos y fallos de conformidad; exigir garantías específicas de IA sobre finalidad prevista, mitigación de sesgo y plazos de notificación de incidentes."
  ]},
  { id: 17, tier: "Level 02", category: "Riesgo de terceros", scenarioText: "Un proveedor de transcripción con IA subcontrata audio a una región en la nube fuera del EEE sin Standard Contractual Clauses ni documentación de Transfer Impact Assessment. Las grabaciones institucionales incluyen audiencias disciplinarias protegidas por legislación laboral. ¿Qué corrección de riesgo de terceros se exige a nivel ejecutivo?", options: [
    "Suspender el tratamiento, exigir SCCs y TIAs o salvaguardias equivalentes, mapear subencargados y prohibir la transferencia hasta documentar el cumplimiento de los requisitos del Chapter V GDPR.",
    "Continuar el tratamiento porque la precisión de transcripción prevalecía sobre las formalidades de transferencia en el caso de negocio.",
    "Cifrar los archivos de audio localmente y asumir que el cifrado por sí solo satisface reglas de transferencia transfronteriza sin evaluación ulterior.",
    "Anonimizar participantes sustituyendo nombres por iniciales solo en los nombres de archivo."
  ]},
  { id: 18, tier: "Level 02", category: "Marco de gobernanza", scenarioText: "El consejo solicita un marco unificado de gobernanza de IA antes de aprobar una cartera de pilotos de RR. HH., finanzas e investigación. ¿Qué conjunto de elementos satisface la madurez de gobernanza ejecutiva bajo las expectativas institucionales de alfabetización del Article 4?", options: [
    "Una nota de uso aceptable de una página que haga referencia a condiciones del proveedor.",
    "Una carta de gobernanza de IA ratificada por el consejo que defina taxonomía de riesgos, responsabilidad por funciones, etapas del ciclo de vida, escalada de incidentes, mandatos de formación en alfabetización y requisitos de certificación respaldados por ledger.",
    "Un canal informal de Slack para que entusiastas de IA compartan prompts y herramientas.",
    "Delegación de todas las funciones de gobernanza a responsables departamentales individuales sin estándares centrales."
  ]},
  { id: 19, tier: "Level 02", category: "Pista de auditoría", scenarioText: "Reguladores preguntan si la institución puede reconstruir quién autorizó el despliegue de un chatbot orientado al cliente y qué versión de modelo estaba activa en una fecha concreta. Los registros actuales están fragmentados en paneles del proveedor sin política institucional de retención. ¿Qué capacidad de pista de auditoría deben priorizar ejecutivos?", options: [
    "Basarse en tickets de soporte del proveedor como evidencia ad hoc de decisiones de despliegue.",
    "Capturar capturas de pantalla de paneles de administración trimestralmente.",
    "Implementar registro inmutable controlado por la institución de aprobaciones de despliegue, identificadores de versión de modelo, cambios de configuración y responsables, con retención alineada con períodos de consulta regulatoria.",
    "Destruir registros después de noventa días para minimizar costes de almacenamiento y exposición de responsabilidad."
  ]},
  { id: 20, tier: "Level 02", category: "Responsabilidad ejecutiva", scenarioText: "Tras un incidente público en el que una comunicación generada por IA declaró erróneamente el estado de acreditación, la atención mediática se centra en si la alta dirección ejerció supervisión adecuada. El CEO pregunta al asesor qué estándar de responsabilidad se aplica a decisores ejecutivos bajo la doctrina de alfabetización y gobernanza del EU AI Act.", options: [
    "Los ejecutivos no tienen responsabilidad si confiaron en personal informático certificado y garantías del proveedor.",
    "La responsabilidad corresponde solo al proveedor del modelo una vez que el sistema lleva marcado CE.",
    "La gestión de relaciones públicas satisface obligaciones de responsabilidad si se emiten correcciones en cuarenta y ocho horas.",
    "La alta dirección debe demostrar alfabetización de IA verificable, aprobación documentada de aceptabilidad del riesgo y mecanismos de supervisión de buena fe; la delegación no extingue deberes institucionales ni personales de gobernanza."
  ]},
  { id: 21, tier: "Level 03", category: "Despliegue de sistema de alto riesgo", scenarioText: "Un centro médico académico autorizado planea desplegar un sistema de apoyo diagnóstico de IA clasificado de alto riesgo conforme al Annex III del EU AI Act. El despliegue está programado antes de completar la documentación de evaluación de conformidad. Como responsable de gobernanza del socio institucional, ¿qué puerta de despliegue debe imponerse?", options: [
    "Bloquear el despliegue en producción hasta que se cumplan y archiven la evaluación de conformidad, el marcado CE cuando sea aplicable, la integración de gestión de calidad y las obligaciones de registro en la base de datos de la UE.",
    "Proceder bajo exenciones de urgencia clínica sin documentación, documentando la justificación posterior solo si ocurren eventos adversos.",
    "Limitar el despliegue a clínicos de beta privada que firmen reconocimientos informales de confidencialidad.",
    "Desplegar exclusivamente en instalaciones propias para evitar activadores de clasificación de alto riesgo relacionados con la nube."
  ]},
  { id: 22, tier: "Level 03", category: "Auditoría con intervención humana", scenarioText: "Una IA de puntuación crediticia de alto riesgo opera con revisores humanos que anulan menos del 0,3 % de decisiones, principalmente para cumplir SLA de rendimiento. Auditoría interna determina que revisores dedican una media de once segundos por caso. ¿Qué estándar de auditoría con intervención humana debe exigir el socio institucional?", options: [
    "Mantener objetivos actuales de rendimiento; las tasas de anulación son estadísticamente insignificantes.",
    "Rediseñar flujos de revisión para garantizar evaluación humana significativa, supervisar la calidad de anulaciones, volver a formar revisores y suspender la ampliación de automatización hasta que métricas demuestren supervisión sustantiva y no aprobación meramente formal.",
    "Sustituir revisores humanos por una IA secundaria para mejorar coherencia.",
    "Publicar externamente estadísticas de anulación sin cambiar prácticas operativas."
  ]},
  { id: 23, tier: "Level 03", category: "Verificación WaqfLedger", scenarioText: "Un socio institucional completa certificación Level 03 para cincuenta docentes y debe registrar inmutablemente cada credencial en el Sovereign Algorithmic Governance Ledger de WaqfLedger.tech. Una exportación por lotes contiene identificadores de candidatos, marcas temporales de examen, nivel y hashes de estado SHA-256 a prueba de manipulaciones. ¿Qué protocolo satisface la verificación criptográfica?", options: [
    "Enviar adjuntos CSV por correo a TI institucional para guardarlos en hojas de cálculo locales.",
    "Publicar hashes en el sitio web público de la institución sin integración con el ledger.",
    "Transmitir eventos estructurados de certificación a WaqfLedger.tech mediante el flujo de hashing aprobado, verificar recibos de confirmación en el ledger y reconciliar cada insignia emitida con su registro inmutable antes de activar URL de verificación pública.",
    "Guardar hashes en una carpeta compartida en la nube accesible solo a administradores asociados."
  ]},
  { id: 24, tier: "Level 03", category: "Evaluación de conformidad", scenarioText: "Una institución desplegadora integra un módulo de categorización biométrica de terceros. El proveedor entrega documentación técnica parcial pero rechaza participar en evaluación de organismo notificado, afirmando que es un componente API de bajo riesgo. El asesor institucional clasifica el uso integrado como alto riesgo. ¿Qué vía de conformidad es autorizada?", options: [
    "Aceptar la clasificación del proveedor para preservar plazos de integración.",
    "Renombrar internamente el caso de uso como «analítica de investigación» para reducir la clasificación regulatoria.",
    "Externalizar el tratamiento biométrico a una filial no perteneciente a la UE para eludir requisitos de conformidad.",
    "Aplicar obligaciones del desplegador para sistemas de alto riesgo: verificar pruebas de conformidad del proveedor, asegurar marcado CE e instrucciones de uso, implementar registro y supervisión humana, y rechazar integración cuando falte evidencia de evaluación exigida."
  ]},
  { id: 25, tier: "Level 03", category: "Supervisión posterior a la comercialización", scenarioText: "Seis meses después de desplegar un sistema de puntuación de admisiones habilitado por IA de alto riesgo, las métricas de disparidad demográfica se desvían más allá de umbrales validados, aunque el proveedor no ha emitido aviso de actualización. ¿Qué respuesta de supervisión posterior cumple obligaciones del socio institucional?", options: [
    "Activar el plan institucional de supervisión posterior: documentación de incidentes, notificación al proveedor, revisión humana provisional de decisiones afectadas, comunicación al regulador si procede y suspensión de decisiones automatizadas hasta análisis de causa raíz.",
    "Esperar comunicaciones del proveedor antes de actuar para evitar costes de corrección duplicados.",
    "Recalibrar paneles de visualización para ocultar métricas de disparidad a partes interesadas no técnicas.",
    "Formar al personal de admisiones para ajustar manualmente puntuaciones a posteriori sin investigación sistémica."
  ]},
  { id: 26, tier: "Level 03", category: "Transferencia transfronteriza", scenarioText: "Un socio institucional multinacional centraliza el ajuste fino de modelos de IA en un lago de datos estadounidense con expedientes de estudiantes de la UE. El DPO señala ausencia de Medidas Complementarias tras la jurisprudencia Schrems II. La dirección ejecutiva presiona para mantener el flujo por razones de coste. ¿Qué decisión de gobernanza transfronteriza es conforme?", options: [
    "Continuar transferencias basándose en garantías del proveedor de «seguridad de nivel empresarial».",
    "Detener transferencias hasta que mecanismos lícitos y Transfer Impact Assessments documentadas demuestren derechos exigibles para interesados; implementar tratamiento residente en la UE o salvaguardias contractuales aprobadas antes de reanudar el ajuste fino.",
    "Seudonimizar expedientes eliminando nombres de pila pero conservando números de identidad nacional en el conjunto de entrenamiento.",
    "Trasladar responsabilidad a estudiantes mediante formularios de consentimiento de matrícula que mencionen tratamiento internacional."
  ]},
  { id: 27, tier: "Level 03", category: "Evaluación de impacto algorítmico", scenarioText: "Antes de renovar una licencia institucional para software de supervisión de exámenes por IA, organizaciones de la sociedad civil alegan falsos positivos desproporcionados para examinados con discapacidades documentadas. La institución asociada debe encargar una evaluación de impacto algorítmico. ¿Qué metodología satisface el rigor del socio institucional?", options: [
    "Revisar materiales de marketing del proveedor que citan referencias de equidad sobre conjuntos de datos no revelados.",
    "Encuestar a administradores de supervisión sobre puntuaciones subjetivas de satisfacción.",
    "Realizar una AIA independiente que examine derechos afectados, adaptaciones por discapacidad, distribución de errores por características protegidas, alternativas menos intrusivas y consulta de partes interesadas, con mitigación vinculante antes de renovar.",
    "Limitar la evaluación a revisión jurídica de actualizaciones de condiciones de servicio del proveedor."
  ]},
  { id: 28, tier: "Level 03", category: "Registro inmutable", scenarioText: "El responsable de cumplimiento de un socio institucional descubre que los registros de sistemas de IA almacenados en una consola SaaS del proveedor pueden ser editados por ingenieros de soporte sin notificación institucional. La documentación de despliegue de alto riesgo exige registros evidentes ante manipulación. ¿Qué arquitectura de registro debe exigirse?", options: [
    "Seguir confiando en registros de consola del proveedor con exportaciones semanales en PDF.",
    "Registrar solo métricas agregadas de uso para reducir almacenamiento y carga de privacidad.",
    "Confiar en confirmaciones verbales de gerentes de cuenta del proveedor de que los registros son «efectivamente inmutables».",
    "Exigir replicación de registros de solo anexado, controlada institucionalmente, con pruebas criptográficas de integridad, acceso segregado y sincronización con flujos de auditoría elegibles para WaqfLedger.tech para certificación y reconstrucción de incidentes."
  ]},
  { id: 29, tier: "Level 03", category: "Gobernanza soberana", scenarioText: "Un ministerio nacional designa a su institución como Centro Académico Autorizado bajo L'INSTITUT ARTICLE 4 (A4I), concede cincuenta tokens prepagados de examen Level 01 y exige alineación de gobernanza soberana. Un decano propone vender tokens sobrantes a corporaciones externas no cubiertas por la licencia B2B. ¿Qué acción protege la integridad de gobernanza soberana?", options: [
    "Rechazar la comercialización no autorizada de tokens, aplicar el alcance de licencia conforme a términos B2B institucionales del registro de constantes e informar la asignación de tokens mediante el panel autorizado con verificación respaldada por WaqfLedger de cada evento de certificación.",
    "Aprobar la reventa a precios de mercado para financiar becas departamentales.",
    "Transferir tokens a docentes individuales como propiedad personal.",
    "Crear un mercado secundario no registrado con precios por volumen descontados para startups de antiguos alumnos."
  ]},
  { id: 30, tier: "Level 03", category: "Certificación de socio institucional", scenarioText: "Al otorgarse la Insignia de Socio Institucional Level 03, el socio debe habilitar verificación pública en https://safeai.report/verification vinculando credenciales de candidatos a registros WaqfLedger.tech. Un lote de tres credenciales no logra reconciliar hashes por desfase de reloj durante el envío del examen. ¿Qué protocolo de finalización de certificación es autorizado?", options: [
    "Emitir insignias inmediatamente y corregir entradas del ledger oportunamente cuando resulte conveniente.",
    "Retener la activación de verificación pública hasta que la reconciliación de hashes tenga éxito, volver a sellar los artefactos del examen con hash de estado SHA-256 a prueba de manipulaciones bajo el protocolo Sovereign Algorithmic Governance Ledger y documentar la corrección en el registro de auditoría del socio institucional antes de liberar credenciales.",
    "Publicar insignias con una advertencia de que la verificación del ledger puede no estar disponible temporalmente.",
    "Editar manualmente hashes del ledger para que coincidan con insignias emitidas sin nuevo examen ni nuevo sellado."
  ]}
];

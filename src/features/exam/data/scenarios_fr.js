/**
 * Client-facing Examination Matrix — French (FR)
 * 30 scenarios — IDs and option indices aligned with scenarios_en.js for server grading.
 */
export const EXAM_SCENARIO_MATRIX_FR = [
  {
    id: 1,
    tier: "Level 01",
    category: "Transparence",
    scenarioText: "Un agent municipal reçoit une note d'orientation générée par IA résumant des propositions de règlement d'urbanisme. Le document ne comporte aucune attribution indiquant une synthèse automatisée et l'agent doit le diffuser aux élus dans l'heure. Au regard des obligations de littératie en IA prévues à l'Article 4, quelle démarche satisfait à la norme minimale de contrôle humain transparent avant diffusion institutionnelle ?",
    options: [
      "Divulguer l'utilisation d'une IA générative, vérifier chaque référence réglementaire citée auprès des sources législatives primaires et documenter l'examen humain avant diffusion.",
      "Diffuser immédiatement la note, puisque la rédaction assistée par IA est présumée conforme lorsque les textes législatifs sources sont accessibles au public.",
      "Ajouter une clause de non-responsabilité générique indiquant que le document peut contenir des erreurs, sans préciser l'intervention de l'IA ni procéder à une vérification substantielle.",
      "Reporter indéfiniment la diffusion jusqu'à l'achèvement d'un audit juridique tiers du corpus d'entraînement du fournisseur d'IA."
    ],
  },
  {
    id: 2, tier: "Level 01", category: "Contrôle humain",
    scenarioText: "Un coordinateur RH utilise un outil de présélection de CV qui attribue des scores automatisés de rejet aux candidats. Un candidat demande une explication de sa disqualification. Le coordinateur n'a reçu aucune formation sur la logique décisionnelle du système. Quelle réponse est conforme au principe de contrôle humain imposé par les exigences de littératie de l'EU AI Act ?",
    options: [
      "Informer le candidat que les décisions algorithmiques sont propriétaires et ne peuvent donc pas être divulguées en vertu des clauses de confidentialité du fournisseur.",
      "Transmettre la demande à un examinateur humain qualifié, engager une réévaluation manuelle documentée et consigner l'intervention de contrôle dans la piste d'audit institutionnelle.",
      "Faire repasser le profil du candidat dans le système pour confirmer le score de rejet, en considérant qu'un résultat identique constitue une explication suffisante.",
      "Conseiller au candidat de postuler à nouveau en utilisant des conventions de formatage connues pour générer des scores favorables dans le processus automatisé."
    ],
  },
  {
    id: 3, tier: "Level 01", category: "Protection des données",
    scenarioText: "Un assistant administratif de santé est invité par un chatbot commercial à coller le code de diagnostic et la date de naissance d'un patient afin de « générer une lettre de prise de contact empathique ». Il travaille dans une clinique d'un État membre de l'UE soumise au GDPR. Quel traitement de cette demande est conforme ?",
    options: [
      "Coller les identifiants minimaux nécessaires, car la politique de confidentialité du chatbot indique que les données ne sont pas conservées au-delà de la session.",
      "Anonymiser uniquement le nom de famille du patient tout en conservant le code de diagnostic et la date de naissance, en considérant qu'une occultation partielle suffit à désidentifier les données.",
      "Refuser de saisir des données de santé identifiantes dans un système externe non approuvé ; utiliser un processus autorisé par l'institution, conforme au GDPR et assorti d'une base juridique de traitement documentée.",
      "Demander le consentement verbal du patient par téléphone avant de coller ses données, sans évaluer l'accord avec le sous-traitant ni l'incidence du transfert."
    ],
  },
  {
    id: 4, tier: "Level 01", category: "Littératie fondamentale",
    scenarioText: "Lors d'un atelier interne, un collègue affirme que « les grands modèles de langage détiennent une connaissance faisant autorité du droit en vigueur parce qu'ils sont entraînés sur des corpus juridiques ». En tant que candidat certifié en littératie de l'IA, quelle rectification reflète le plus exactement les limites épistémiques des systèmes génératifs selon les normes professionnelles de conformité ?",
    options: [
      "Les modèles entraînés sur des corpus juridiques ont force obligatoire lorsque leur score de confiance dépasse quatre-vingt-dix pour cent.",
      "Les systèmes génératifs sont impropres à tout usage professionnel et doivent être interdits de manière catégorique dans les institutions réglementées.",
      "L'exactitude juridique est garantie lorsque le fournisseur du modèle publie une attestation SOC 2 Type II.",
      "Les grands modèles de langage reproduisent des schémas probabilistes issus des données d'entraînement et peuvent produire des affirmations juridiques plausibles mais erronées ou obsolètes ; une vérification humaine auprès de sources faisant autorité est obligatoire."
    ],
  },
  {
    id: 5, tier: "Level 01", category: "Responsabilité de l'utilisateur",
    scenarioText: "Un analyste financier déploie un assistant génératif pour rédiger une note d'investissement contenant des projections de performance prospective. Il entend soumettre la note sous ses propres qualifications professionnelles. Quel comportement satisfait à la doctrine de responsabilité de l'utilisateur relevant de la littératie en IA prévue par l'Article 4 ?",
    options: [
      "Valider indépendamment toutes les affirmations quantitatives, assumer la responsabilité personnelle du contenu final et conserver la preuve de l'examen humain ainsi que des corrections importantes apportées.",
      "Soumettre la note telle quelle, à condition que l'outil d'IA soit mentionné dans une note de bas de page comme « aide à la recherche ».",
      "Transférer la responsabilité au fournisseur d'IA par le contrat de licence du logiciel, qui indemnise les utilisateurs finaux en cas d'erreur de contenu.",
      "Limiter l'examen à la correction orthographique et à la mise en forme, car les systèmes génératifs sont exemptés des règles de divulgation applicables aux valeurs mobilières."
    ],
  },
  {
    id: 6, tier: "Level 01", category: "Identification des risques",
    scenarioText: "Un salarié reçoit un appel vocal prétendument émis par le directeur financier de l'institution, lui ordonnant un virement urgent. La voix est très convaincante et fait référence à des noms de projets internes. Le salarié apprend ensuite qu'un outil génératif de clonage vocal a été utilisé. Quelle mesure préventive reflète la reconnaissance des risques quotidiens de fraude facilitée par l'IA ?",
    options: [
      "Se fier uniquement à la biométrie vocale, car l'audio synthétique ne peut pas reproduire de manière convaincante les caractéristiques vocales d'un dirigeant.",
      "Mettre en œuvre des protocoles de vérification hors bande pour les instructions financières, former le personnel à l'ingénierie sociale facilitée par les deepfakes et traiter l'usurpation d'identité augmentée par l'IA comme une menace opérationnelle permanente.",
      "Désactiver toutes les communications téléphoniques au profit du courrier électronique, qui ne peut pas être falsifié par des systèmes d'IA.",
      "Autoriser les virements inférieurs à un seuil sans vérification afin de préserver la rapidité opérationnelle."
    ],
  },
  {
    id: 7, tier: "Level 01", category: "Consentement éclairé",
    scenarioText: "Un service d'orientation universitaire déploie un agent conversationnel pour trier les demandes d'orientation en santé mentale des étudiants. Les étudiants ne sont pas informés que leurs réponses sont traitées par un intermédiaire d'IA avant l'examen par un conseiller humain. Quelle mesure corrective satisfait aux obligations de consentement éclairé et de transparence ?",
    options: [
      "Publier l'information relative à l'IA sur la page web de l'avis annuel de confidentialité de l'institution sans modifier l'interface de tri.",
      "Présumer un consentement implicite parce que les étudiants ont volontairement accédé au portail d'orientation.",
      "Fournir, au moment opportun, une information claire indiquant qu'un système d'IA intervient dans le triage, décrire l'utilisation des données et les voies d'examen humain, puis obtenir un acquiescement explicite avant de recueillir des réponses sensibles.",
      "Supprimer discrètement le composant d'IA tout en conservant les historiques d'interaction sans en informer les étudiants concernés."
    ],
  },
  {
    id: 8, tier: "Level 01", category: "Vérification des résultats",
    scenarioText: "Un responsable des achats demande à un modèle génératif de résumer trois clauses contractuelles de fournisseurs régissant les plafonds de responsabilité. Le modèle renvoie des citations assurées avec une numérotation de clauses inexistante dans les PDF sources. Quel protocole de vérification satisfait aux normes de base de littératie en IA ?",
    options: [
      "Accepter le résumé si les parties prenantes internes estiment qu'il reflète l'intention négociée, quelle que soit l'exactitude des citations.",
      "Demander au modèle de régénérer le résumé jusqu'à ce que la numérotation des clauses corresponde, en considérant la cohérence entre itérations comme une validation.",
      "Externaliser la vérification au fournisseur, puisque l'interprétation des documents de la contrepartie relève de sa responsabilité.",
      "Recouper chaque clause citée avec le texte contractuel faisant autorité, signaler les citations hallucinées et interdire toute dépendance à une sortie de modèle non vérifiée pour les décisions contraignantes."
    ],
  },
  {
    id: 9, tier: "Level 01", category: "Sensibilisation aux biais",
    scenarioText: "Un outil de planification alimenté par IA attribue systématiquement des postes de nuit aux employés dont les noms de famille sont corrélés à certains groupes d'origine ethnique de la région d'entraînement. Les superviseurs constatent cette tendance mais l'attribuent à une « optimisation aléatoire ». Quelle action reflète une reconnaissance conforme des biais selon les attentes de littératie de l'Article 4 ?",
    options: [
      "Suspendre la planification automatisée dans l'attente d'une évaluation d'impact, informer les parties prenantes de la gouvernance et engager des mesures correctives, y compris des tests de biais et une réconciliation humaine des affectations.",
      "Continuer à utiliser l'outil tant qu'aucune plainte officielle pour discrimination n'est déposée.",
      "Modifier les paramètres d'affichage afin que les schémas d'affectation soient moins visibles pour les responsables de terrain.",
      "Remplacer l'outil par un produit identique d'un autre fournisseur sans examiner les données sous-jacentes ni le comportement du modèle."
    ],
  },
  {
    id: 10, tier: "Level 01", category: "Identification des risques quotidiens",
    scenarioText: "Un membre du personnel téléverse un plan stratégique interne sur un site public gratuit d'IA générative afin « d'améliorer la rédaction ». Le document contient des feuilles de route de produits non publiées et les tarifs des partenaires. Quelle réponse immédiate satisfait aux protocoles de risque quotidien d'exfiltration de données ?",
    options: [
      "Aucune action n'est requise si la session a été supprimée après la copie locale du texte amélioré.",
      "Signaler l'incident via le canal institutionnel de sécurité des données, déclencher les procédures d'évaluation de violation, révoquer toute utilisation ultérieure d'outils non approuvés et documenter les mesures correctives, y compris la journalisation d'audit admissible à WaqfLedger le cas échéant.",
      "Modifier les noms d'utilisateur sur la plateforme d'IA pour empêcher l'attribution du téléversement.",
      "Émettre une note à l'échelle du service décourageant les téléversements sans informer la sécurité de l'information ni évaluer l'incidence sur la confidentialité contractuelle."
    ],
  },
  {
    id: 11, tier: "Level 02", category: "Risque lié aux achats",
    scenarioText: "Le directeur des systèmes d'information d'une institution propose l'adoption d'une suite d'IA générative d'entreprise par un marché de gré à gré justifié par « l'urgence du marché ». Le fournisseur refuse de divulguer la fréquence des mises à jour du modèle, la provenance des données d'entraînement ou les sous-traitants ultérieurs. Selon les normes de gouvernance exécutive alignées sur la diligence requise par l'EU AI Act, quelle position en matière d'achat est conforme ?",
    options: [
      "Procéder à l'attribution de gré à gré afin d'éviter les retards concurrentiels, en conditionnant la conformité aux engagements publics de marketing du fournisseur.",
      "Déléguer la validation des achats à l'équipe de réussite client du fournisseur, qui certifie un alignement de bonne foi avec des cadres réglementaires non précisés.",
      "Suspendre l'attribution jusqu'à ce que les annexes contractuelles de transparence de l'IA, les registres de sous-traitants, les clauses de notification de modification du modèle et la documentation de conformité soient négociés et examinés juridiquement.",
      "Accorder une licence uniquement à une cohorte pilote, éliminant ainsi les obligations de gouvernance au niveau de l'entreprise."
    ],
  },
  {
    id: 12, tier: "Level 02", category: "Diligence raisonnable fournisseur",
    scenarioText: "Un fournisseur proposé d'analytique par IA remet une brochure soignée « Éthique et sécurité », mais aucune documentation technique, classification des risques ni déclaration UE de conformité pour des modules présentés comme prenant en charge une « aide à la décision à forts enjeux ». Quelle norme de diligence raisonnable le conseil de gouvernance exécutive doit-il imposer avant le déploiement institutionnel ?",
    options: [
      "Accepter la brochure comme preuve suffisante d'alignement éthique lorsqu'elle est assortie d'un contrat pluriannuel à prix réduit.",
      "S'en remettre aux décisions d'adoption d'institutions comparables comme certification implicite de l'adéquation du fournisseur.",
      "Limiter le déploiement aux juridictions hors UE afin d'éviter entièrement les exigences documentaires.",
      "Exiger une documentation technique vérifiable, des déclarations d'usage prévu, les limitations connues, la classification applicable du niveau de risque et une validation indépendante des affirmations importantes pour les cas d'utilisation réglementés."
    ],
  },
  {
    id: 13, tier: "Level 02", category: "Divulgation du modèle",
    scenarioText: "Un fournisseur de modèle de fondation modifie les conditions de son API pour autoriser l'utilisation sans restriction des invites utilisateurs à des fins d'entraînement ultérieur, sauf opposition des clients entreprise dans un délai de trente jours. Votre institution traite des données de recherche confidentielles par cette API au titre de contrats existants silencieux sur la réutilisation à des fins d'entraînement. Quelle action exécutive satisfait aux obligations de divulgation du modèle et de gouvernance des données ?",
    options: [
      "Effectuer un examen contractuel d'urgence, exercer le droit d'opposition ou de migration, notifier les responsables de traitement concernés et modifier la politique institutionnelle d'utilisation acceptable de l'IA pour refléter les risques de réutilisation des données d'entraînement.",
      "Poursuivre l'utilisation selon les conditions historiques, en affirmant que le silence implique une confidentialité perpétuelle.",
      "Demander aux chercheurs de paraphraser les invites afin que la capture verbatim aux fins d'entraînement soit impossible.",
      "Accepter les nouvelles conditions parce que les fournisseurs de l'ensemble du secteur se réservent uniformément des droits d'entraînement."
    ],
  },
  {
    id: 14, tier: "Level 02", category: "Red teaming",
    scenarioText: "Avant de déployer auprès du personnel un assistant ajusté institutionnellement, le comité de gouvernance doit autoriser un protocole de red teaming. Quelle portée de tests adversariaux satisfait aux attentes de red teaming au niveau exécutif pour des systèmes génératifs traitant des bases de connaissances internes ?",
    options: [
      "N'exécuter que des contrôles orthographiques automatisés et des tests de latence, les modèles génératifs étant stochastiques par nature et les tests adversariaux non concluants.",
      "Commander un red teaming structuré couvrant l'injection d'invites, l'exfiltration de données, l'escalade de privilèges, les sorties nuisibles et les tentatives de contournement des garde-fous, avec remédiation documentée des constats importants avant la mise en production.",
      "Limiter les tests à la carte de sécurité publiée par le fournisseur sans scénarios d'attaque propres à l'institution.",
      "Reporter le red teaming après le déploiement complet afin de capter naturellement les modes de défaillance réels."
    ],
  },
  {
    id: 15, tier: "Level 02", category: "Responsabilité institutionnelle",
    scenarioText: "Une université qui concède sous licence une IA tierce de détection du plagiat attribue des notes éliminatoires uniquement sur l'indice de similarité de l'outil, sans examen académique humain. Des étudiants font appel, invoquant des faux positifs sur des travaux collaboratifs correctement cités. Quelle décision de gouvernance traite correctement la responsabilité institutionnelle ?",
    options: [
      "Défendre les notes au motif que l'algorithme du fournisseur est une norme sectorielle et est donc présumé fiable.",
      "Faire indemniser l'institution par le contrat fournisseur et poursuivre l'évaluation automatisée à grande échelle.",
      "Imposer un examen académique humain dans la boucle pour toute mesure défavorable, suspendre le recours exclusif aux scores automatisés et réviser la politique afin d'attribuer à l'institution la responsabilité des décisions finales.",
      "Transférer la responsabilité aux étudiants en les obligeant à accepter la détection par IA dans les contrats d'inscription."
    ],
  },
  {
    id: 16, tier: "Level 02", category: "Conformité contractuelle",
    scenarioText: "Le conseil juridique examine un accord-cadre de fournisseur d'IA contenant une clause large de limitation de responsabilité plafonnant les dommages à douze mois de frais, alors que le système soutient des recommandations de solvabilité concernant des consommateurs de l'UE. Quelle position contractuelle est conforme à la gouvernance exécutive et à la prudence en matière de responsabilité institutionnelle ?",
    options: [
      "Accepter le plafond sans condition afin d'accélérer les indicateurs de performance de transformation numérique.",
      "Supprimer tous les plafonds de responsabilité en supprimant la clause sans instruments de remplacement.",
      "Transférer l'accord à une filiale écran afin d'isoler l'exposition de l'institution.",
      "Négocier des exclusions pour les amendes réglementaires, les indemnisations liées aux violations de données et les défaillances de conformité ; exiger des garanties spécifiques à l'IA sur l'usage prévu, l'atténuation des biais et les délais de notification des incidents."
    ],
  },
  {
    id: 17, tier: "Level 02", category: "Risque de tiers",
    scenarioText: "Un fournisseur de transcription par IA sous-traite l'audio vers une région cloud hors EEE sans Standard Contractual Clauses ni documentation d'évaluation d'impact relative au transfert. Les enregistrements institutionnels comprennent des audiences disciplinaires protégées par le droit du travail. Quelle remédiation du risque de tiers est requise au niveau exécutif ?",
    options: [
      "Suspendre le traitement, exiger des SCC et des TIA ou des garanties équivalentes, cartographier les sous-traitants et interdire le transfert jusqu'à la conformité documentée aux exigences du Chapitre V du GDPR.",
      "Poursuivre le traitement parce que l'exactitude de la transcription prévalait sur les formalités de transfert dans l'analyse de rentabilité.",
      "Chiffrer les fichiers audio localement et présumer que le seul chiffrement satisfait aux règles de transfert transfrontalier sans évaluation supplémentaire.",
      "Anonymiser les participants aux audiences en remplaçant les noms par des initiales uniquement dans les noms de fichiers."
    ],
  },
  {
    id: 18, tier: "Level 02", category: "Cadre de gouvernance",
    scenarioText: "Le conseil d'administration demande un cadre unifié de gouvernance de l'IA avant d'approuver un portefeuille de projets pilotes couvrant les RH, la finance et la recherche. Quel ensemble d'éléments de cadre satisfait au niveau de maturité de gouvernance exécutive selon les attentes de littératie institutionnelle de l'Article 4 ?",
    options: [
      "Une note d'utilisation acceptable d'une page renvoyant aux conditions de service du fournisseur.",
      "Une charte de gouvernance de l'IA ratifiée par le conseil, définissant une taxonomie des risques, la responsabilité des rôles, les jalons du cycle de vie, l'escalade des incidents, les obligations de formation à la littératie et les exigences de certification étayées par un registre.",
      "Un canal Slack informel permettant aux passionnés d'IA de partager des invites et des outils.",
      "La délégation de toutes les fonctions de gouvernance aux responsables de chaque service sans normes centrales."
    ],
  },
  {
    id: 19, tier: "Level 02", category: "Piste d'audit",
    scenarioText: "Les autorités de régulation demandent si l'institution peut reconstituer qui a autorisé le déploiement d'un chatbot destiné aux clients et quelle version du modèle était active à une date donnée. Les journaux actuels sont fragmentés entre des tableaux de bord fournisseurs sans politique de conservation institutionnelle. Quelle capacité de piste d'audit les dirigeants doivent-ils prioriser ?",
    options: [
      "S'appuyer sur les tickets d'assistance du fournisseur comme preuve ponctuelle des décisions de déploiement.",
      "Capturer des captures d'écran des panneaux d'administration sur une base trimestrielle.",
      "Mettre en œuvre une journalisation immuable, contrôlée par l'institution, des approbations de déploiement, des identifiants de version de modèle, des changements de configuration et des responsables, avec une conservation alignée sur les périodes d'enquête réglementaire.",
      "Détruire les journaux après quatre-vingt-dix jours afin de réduire les coûts de stockage et l'exposition à la responsabilité."
    ],
  },
  {
    id: 20, tier: "Level 02", category: "Responsabilité exécutive",
    scenarioText: "Après un incident public au cours duquel une communication générée par IA a erronément indiqué un statut d'accréditation, l'attention des médias porte sur l'existence d'un contrôle adéquat par la direction. Le directeur général demande au conseil juridique quelle norme de responsabilité s'applique aux décideurs exécutifs selon la doctrine de littératie et de gouvernance de l'EU AI Act.",
    options: [
      "Les dirigeants n'assument aucune responsabilité s'ils se sont appuyés sur du personnel informatique certifié et les assurances du fournisseur.",
      "La responsabilité incombe uniquement au fournisseur du modèle dès lors que le système porte le marquage CE.",
      "La gestion des relations publiques satisfait aux obligations de responsabilité si des déclarations corrigées sont publiées dans les quarante-huit heures.",
      "La direction doit démontrer une littératie en IA vérifiable, une approbation documentée de l'acceptabilité des risques et des mécanismes de contrôle exercés de bonne foi ; la délégation n'éteint pas les devoirs de gouvernance institutionnels ou personnels."
    ],
  },
  {
    id: 21, tier: "Level 03", category: "Déploiement de système à haut risque",
    scenarioText: "Un centre médical universitaire autorisé prévoit de déployer un système d'aide au diagnostic par IA classé à haut risque au titre de l'Annex III de l'EU AI Act. Le déploiement est programmé avant l'achèvement de la documentation d'évaluation de conformité. En tant que responsable de la gouvernance du partenaire institutionnel, quelle étape de contrôle du déploiement doit être imposée ?",
    options: [
      "Bloquer le déploiement en production jusqu'à ce que l'évaluation de conformité, le marquage CE le cas échéant, l'intégration à la gestion de la qualité et les obligations d'enregistrement dans la base de données de l'UE soient satisfaits et archivés.",
      "Procéder au titre d'exemptions d'urgence clinique sans documentation, en ne documentant la justification a posteriori qu'en cas d'événements indésirables.",
      "Limiter le déploiement à des cliniciens en bêta privée qui signent des engagements informels de confidentialité.",
      "Déployer exclusivement sur site afin d'éviter les facteurs de classification à haut risque liés au cloud."
    ],
  },
  {
    id: 22, tier: "Level 03", category: "Audit avec humain dans la boucle",
    scenarioText: "Une IA de notation de crédit à haut risque fonctionne avec des examinateurs humains qui annulent moins de 0,3 % des décisions, principalement pour respecter des SLA de débit. L'audit interne constate que les examinateurs consacrent en moyenne onze secondes à chaque dossier. Quelle norme d'audit avec humain dans la boucle le partenaire institutionnel doit-il imposer ?",
    options: [
      "Maintenir les objectifs de débit actuels ; les taux d'annulation sont statistiquement insignifiants.",
      "Reconcevoir les flux d'examen pour garantir une évaluation humaine significative, surveiller la qualité des annulations, former de nouveau les examinateurs et suspendre l'extension de l'automatisation jusqu'à ce que les indicateurs d'audit démontrent un contrôle substantiel plutôt qu'une approbation de pure forme.",
      "Remplacer les examinateurs humains par un système secondaire de vérification par IA afin d'améliorer la cohérence.",
      "Publier les statistiques d'annulation à l'extérieur sans modifier les pratiques opérationnelles."
    ],
  },
  {
    id: 23, tier: "Level 03", category: "Vérification WaqfLedger",
    scenarioText: "Un partenaire institutionnel achève la certification Level 03 de cinquante membres du corps enseignant et doit enregistrer immuablement chaque titre dans le Sovereign Algorithmic Governance Ledger sur WaqfLedger.tech. Une exportation par lot contient les identifiants des candidats, les horodatages d'examen, le niveau et les hachages d'état SHA-256 attestant de l'intégrité. Quel protocole d'enregistrement satisfait aux exigences de vérification cryptographique ?",
    options: [
      "Envoyer des pièces jointes CSV par courriel au service informatique institutionnel pour stockage dans un tableur local.",
      "Publier les hachages sur le site web public de l'institution sans intégration au registre.",
      "Transmettre les événements de certification structurés à WaqfLedger.tech via le pipeline de hachage approuvé, vérifier les reçus de confirmation sur le registre et rapprocher chaque badge délivré de son enregistrement immuable avant d'activer les URL publiques de vérification.",
      "Stocker les hachages dans un dossier cloud partagé, accessible uniquement aux administrateurs partenaires."
    ],
  },
  {
    id: 24, tier: "Level 03", category: "Évaluation de conformité",
    scenarioText: "Une institution déployante intègre un module tiers de catégorisation biométrique. Le fournisseur fournit une documentation technique partielle mais refuse de participer à une évaluation par un organisme notifié, affirmant que le module est un composant API à faible risque. Le conseil juridique institutionnel classe le cas d'utilisation intégré comme étant à haut risque. Quelle voie de conformité fait autorité ?",
    options: [
      "Accepter la classification du fournisseur afin de préserver le calendrier d'intégration.",
      "Renommer en interne le cas d'utilisation « analytique de recherche » afin d'abaisser la classification réglementaire.",
      "Externaliser le traitement biométrique à une filiale non-UE afin de contourner les exigences de conformité.",
      "Appliquer les obligations du déployeur pour les systèmes à haut risque : vérifier les éléments de conformité du fournisseur, garantir le marquage CE et les instructions d'utilisation, mettre en œuvre la journalisation et le contrôle humain, et refuser l'intégration lorsque les preuves d'évaluation requises font défaut."
    ],
  },
  {
    id: 25, tier: "Level 03", category: "Surveillance post-commercialisation",
    scenarioText: "Six mois après le déploiement d'un système de notation des admissions activé par IA à haut risque, les mesures de disparité démographique dérivent au-delà des seuils validés, bien que le fournisseur n'ait pas publié de notification de mise à jour du modèle. Quelle réponse de surveillance post-commercialisation satisfait aux obligations du partenaire institutionnel ?",
    options: [
      "Activer le plan institutionnel de surveillance post-commercialisation : documentation de l'incident, notification au fournisseur, examen humain provisoire des décisions concernées, signalement aux autorités si nécessaire et suspension des décisions automatisées en attendant l'analyse de la cause racine.",
      "Attendre les communications du fournisseur avant d'agir afin d'éviter des coûts de remédiation redondants.",
      "Recalibrer les tableaux de bord pour masquer les mesures de disparité aux parties prenantes non techniques.",
      "Former le personnel des admissions à ajuster manuellement les scores a posteriori sans enquête systémique."
    ],
  },
  {
    id: 26, tier: "Level 03", category: "Transfert transfrontalier",
    scenarioText: "Un partenaire institutionnel multinational centralise le réglage fin de modèles d'IA dans un lac de données américain contenant des dossiers d'étudiants de l'UE. Le DPO du partenaire signale l'absence de mesures supplémentaires à la suite de la jurisprudence Schrems II. La direction insiste pour maintenir le pipeline pour des raisons de coût. Quelle décision de gouvernance transfrontalière est conforme ?",
    options: [
      "Poursuivre les transferts sur la base des assurances du fournisseur relatives à une « sécurité de niveau entreprise ».",
      "Arrêter les transferts jusqu'à ce que des mécanismes licites et des évaluations d'impact relatives au transfert documentées démontrent des droits exécutoires pour les personnes concernées ; mettre en œuvre un traitement hébergé dans l'UE ou des garanties contractuelles approuvées avant de reprendre le réglage fin.",
      "Pseudonymiser les dossiers en supprimant les prénoms tout en conservant les numéros d'identification nationaux dans l'ensemble d'entraînement.",
      "Transférer la responsabilité aux étudiants au moyen de formulaires de consentement à l'inscription faisant référence au traitement international."
    ],
  },
  {
    id: 27, tier: "Level 03", category: "Évaluation d'impact algorithmique",
    scenarioText: "Avant de renouveler une licence institutionnelle de logiciel de surveillance d'examen par IA, des acteurs de la société civile allèguent des faux positifs disproportionnés pour les candidats présentant des handicaps documentés. L'institution partenaire doit commander une évaluation d'impact algorithmique. Quelle méthodologie d'évaluation satisfait à la rigueur attendue d'un partenaire institutionnel ?",
    options: [
      "Examiner les supports marketing du fournisseur citant des critères d'équité sur des jeux de données non divulgués.",
      "Interroger les administrateurs de la surveillance d'examen sur leurs scores subjectifs de satisfaction.",
      "Mener une AIA indépendante examinant les droits affectés, les aménagements liés au handicap, la répartition des erreurs selon les caractéristiques protégées, les alternatives moins intrusives et la consultation des parties prenantes, avec des mesures d'atténuation contraignantes avant le renouvellement.",
      "Limiter l'évaluation à un examen juridique des mises à jour des conditions de service du fournisseur."
    ],
  },
  {
    id: 28, tier: "Level 03", category: "Journalisation immuable",
    scenarioText: "Le responsable de conformité d'un partenaire institutionnel découvre que les journaux du système d'IA stockés dans une console SaaS fournisseur peuvent être modifiés par les ingénieurs d'assistance du fournisseur sans notification de l'institution. La documentation relative au déploiement à haut risque exige des enregistrements attestant de l'absence d'altération. Quelle architecture de journalisation doit être imposée ?",
    options: [
      "Continuer à s'appuyer sur les journaux de la console du fournisseur avec des exportations PDF hebdomadaires.",
      "Ne journaliser que des mesures d'utilisation agrégées afin de réduire la charge de stockage et de protection des données.",
      "Faire confiance aux confirmations verbales des responsables de compte du fournisseur selon lesquelles les journaux sont « effectivement immuables ».",
      "Exiger une réplication de journaux en ajout seul, contrôlée par l'institution, avec preuves d'intégrité cryptographique, accès séparés et synchronisation avec des pipelines d'audit admissibles à WaqfLedger.tech pour la certification et la reconstitution des incidents."
    ],
  },
  {
    id: 29, tier: "Level 03", category: "Gouvernance souveraine",
    scenarioText: "Un ministère national désigne votre institution comme Centre académique autorisé au titre de L'INSTITUT ARTICLE 4 (A4I), lui accordant cinquante jetons d'examen Level 01 prépayés et exigeant un alignement sur la gouvernance souveraine. Un doyen propose de vendre les jetons excédentaires à des entreprises externes non couvertes par la licence B2B. Quelle action préserve l'intégrité de la gouvernance souveraine ?",
    options: [
      "Refuser la commercialisation non autorisée des jetons, faire respecter le périmètre de la licence conformément aux conditions B2B institutionnelles du registre des constantes, et déclarer l'allocation des jetons via le tableau de bord autorisé avec vérification étayée par WaqfLedger de chaque événement de certification.",
      "Approuver la revente aux prix du marché afin de financer des bourses départementales.",
      "Transférer les jetons aux membres individuels du corps enseignant comme biens personnels.",
      "Créer un marché secondaire non enregistré avec une tarification de gros réduite pour les jeunes entreprises fondées par des anciens élèves."
    ],
  },
  {
    id: 30, tier: "Level 03", category: "Certification de partenaire institutionnel",
    scenarioText: "Lors de l'attribution du badge de partenaire institutionnel Level 03, le partenaire doit activer la vérification publique sur https://safeai.report/verification, reliant les titres des candidats aux enregistrements WaqfLedger.tech. Un lot de trois titres échoue au rapprochement des hachages en raison d'un décalage d'horloge lors de la soumission de l'examen. Quel protocole de finalisation de la certification fait autorité ?",
    options: [
      "Délivrer immédiatement les badges et corriger les entrées du registre de manière opportuniste lorsque cela sera commode.",
      "Suspendre l'activation de la vérification publique jusqu'à la réussite du rapprochement des hachages, resceller les éléments d'examen au moyen du hachage d'état SHA-256 attestant de l'intégrité conformément au protocole Sovereign Algorithmic Governance Ledger, et documenter la remédiation dans le dossier d'audit du partenaire institutionnel avant la délivrance des titres.",
      "Publier les badges avec une clause de non-responsabilité indiquant que la vérification par registre peut être temporairement indisponible.",
      "Modifier manuellement les hachages du registre pour qu'ils correspondent aux badges délivrés sans nouvel examen ni nouveau scellement."
    ],
  }
];

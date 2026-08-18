import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHero } from "@/components/site/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/manual")({
  head: () => ({
    meta: [
      { title: "User Manual — How to Use Farmer's AI | 6 Languages" },
      {
        name: "description",
        content:
          "Step-by-step Farmer's AI guide in English, Spanish, French, Hindi, Portuguese and Swahili: photographing samples, reading reports and saving PDFs.",
      },
      { property: "og:title", content: "Farmer's AI User Manual" },
      {
        property: "og:description",
        content: "Multi-language guide to capturing samples and reading your agronomic report.",
      },
    ],
  }),
  component: Page,
});

type Section = { h: string; p: string; li: string[] };
type Doc = { label: string; native: string; intro: string; sections: Section[] };

const DOCS: Record<string, Doc> = {
  en: {
    label: "English",
    native: "English",
    intro:
      "Farmer's AI turns one photograph into a full agronomic report. Analysis is free and needs no account — signing in only saves your history.",
    sections: [
      {
        h: "1. Capture the sample",
        p: "Photo quality decides report quality.",
        li: [
          "Shoot in natural daylight, never with flash.",
          "Fill the frame with the sample; hold the phone steady and parallel.",
          "For leaves, include one healthy leaf for comparison.",
          "For soil, scrape the surface crust and photograph moist soil from 30 cm.",
          "For seeds, spread a single layer of 100+ seeds on white paper.",
        ],
      },
      {
        h: "2. Run the analysis",
        p: "Open Analyze, drop the photo in and add an optional note such as crop, age and irrigation type. Results take about fifteen seconds.",
        li: [],
      },
      {
        h: "3. Read the report",
        p: "The report is organised into blocks relevant to your sample.",
        li: [
          "Identity — species, variety and confidence.",
          "Health — disease, pest and stress findings with severity.",
          "Nutrients — deficiency status per element.",
          "Quality — Brix, pH, ripeness and shelf life for produce.",
          "Soil — texture, pH, organic matter and N-P-K.",
          "Recommendations — organic and conventional actions with timing.",
        ],
      },
      {
        h: "4. Save and share",
        p: "Download the PDF field report for your records, or sign in and press Save to keep it in your dashboard history.",
        li: [],
      },
      {
        h: "5. Limits",
        p: "The report is decision support, not a laboratory result. Confirm major fertiliser, pesticide and harvest decisions with local extension advice and product labels.",
        li: [],
      },
    ],
  },
  es: {
    label: "Spanish",
    native: "Español",
    intro:
      "Farmer's AI convierte una fotografía en un informe agronómico completo. El análisis es gratuito y no requiere cuenta; iniciar sesión solo guarda tu historial.",
    sections: [
      {
        h: "1. Capturar la muestra",
        p: "La calidad de la foto determina la calidad del informe.",
        li: [
          "Fotografía con luz natural, nunca con flash.",
          "Llena el encuadre con la muestra y mantén el teléfono paralelo.",
          "En hojas, incluye una hoja sana como referencia.",
          "En suelo, retira la costra superficial y fotografía a 30 cm.",
          "En semillas, extiende más de 100 semillas en una sola capa sobre papel blanco.",
        ],
      },
      {
        h: "2. Ejecutar el análisis",
        p: "Abre Analizar, sube la foto y añade una nota opcional con el cultivo, la edad y el tipo de riego. El resultado tarda unos quince segundos.",
        li: [],
      },
      {
        h: "3. Leer el informe",
        p: "El informe se organiza en bloques según la muestra.",
        li: [
          "Identidad: especie, variedad y confianza.",
          "Salud: enfermedades, plagas y estrés con severidad.",
          "Nutrientes: estado de deficiencia por elemento.",
          "Calidad: Brix, pH, madurez y vida útil.",
          "Suelo: textura, pH, materia orgánica y N-P-K.",
          "Recomendaciones: acciones orgánicas y convencionales con calendario.",
        ],
      },
      {
        h: "4. Guardar y compartir",
        p: "Descarga el informe en PDF o inicia sesión y pulsa Guardar para conservarlo en tu panel.",
        li: [],
      },
      {
        h: "5. Límites",
        p: "El informe es una ayuda a la decisión, no un resultado de laboratorio. Confirma las decisiones importantes con asesoría técnica local.",
        li: [],
      },
    ],
  },
  fr: {
    label: "French",
    native: "Français",
    intro:
      "Farmer's AI transforme une photo en rapport agronomique complet. L'analyse est gratuite et sans compte ; la connexion sert uniquement à conserver l'historique.",
    sections: [
      {
        h: "1. Photographier l'échantillon",
        p: "La qualité de la photo détermine la qualité du rapport.",
        li: [
          "Photographiez à la lumière du jour, jamais au flash.",
          "Remplissez le cadre avec l'échantillon, téléphone bien parallèle.",
          "Pour les feuilles, incluez une feuille saine comme référence.",
          "Pour le sol, retirez la croûte de surface et photographiez à 30 cm.",
          "Pour les semences, étalez plus de 100 graines en une couche sur papier blanc.",
        ],
      },
      {
        h: "2. Lancer l'analyse",
        p: "Ouvrez Analyser, déposez la photo et ajoutez une note facultative (culture, stade, irrigation). Comptez une quinzaine de secondes.",
        li: [],
      },
      {
        h: "3. Lire le rapport",
        p: "Le rapport est structuré en blocs adaptés à l'échantillon.",
        li: [
          "Identité : espèce, variété, indice de confiance.",
          "Santé : maladies, ravageurs et stress avec sévérité.",
          "Nutriments : carences par élément.",
          "Qualité : Brix, pH, maturité, durée de conservation.",
          "Sol : texture, pH, matière organique, N-P-K.",
          "Recommandations : solutions biologiques et conventionnelles.",
        ],
      },
      {
        h: "4. Enregistrer et partager",
        p: "Téléchargez le rapport PDF, ou connectez-vous et cliquez sur Enregistrer pour le conserver dans votre tableau de bord.",
        li: [],
      },
      {
        h: "5. Limites",
        p: "Le rapport est une aide à la décision, pas une analyse de laboratoire. Validez les décisions majeures auprès d'un conseiller local.",
        li: [],
      },
    ],
  },
  hi: {
    label: "Hindi",
    native: "हिन्दी",
    intro:
      "Farmer's AI एक तस्वीर से पूरी कृषि रिपोर्ट बनाता है। विश्लेषण निःशुल्क है और खाते की आवश्यकता नहीं; लॉगिन केवल इतिहास सहेजने के लिए है।",
    sections: [
      {
        h: "1. नमूने की तस्वीर लें",
        p: "तस्वीर की गुणवत्ता ही रिपोर्ट की गुणवत्ता तय करती है।",
        li: [
          "प्राकृतिक दिन के उजाले में फोटो लें, फ्लैश का उपयोग न करें।",
          "नमूने से पूरा फ्रेम भरें और फोन स्थिर रखें।",
          "पत्तियों के लिए एक स्वस्थ पत्ती भी शामिल करें।",
          "मिट्टी के लिए ऊपरी परत हटाकर 30 सेमी से फोटो लें।",
          "बीजों के लिए 100+ बीज सफेद कागज़ पर एक परत में फैलाएँ।",
        ],
      },
      {
        h: "2. विश्लेषण चलाएँ",
        p: "Analyze पेज खोलें, फोटो अपलोड करें और फसल, आयु व सिंचाई की जानकारी लिखें। परिणाम लगभग पंद्रह सेकंड में मिलता है।",
        li: [],
      },
      {
        h: "3. रिपोर्ट पढ़ें",
        p: "रिपोर्ट नमूने के अनुसार खंडों में बँटी होती है।",
        li: [
          "पहचान — प्रजाति, किस्म और विश्वसनीयता।",
          "स्वास्थ्य — रोग, कीट और तनाव की गंभीरता।",
          "पोषक तत्व — प्रत्येक तत्व की कमी की स्थिति।",
          "गुणवत्ता — ब्रिक्स, pH, पकाव और भंडारण अवधि।",
          "मिट्टी — बनावट, pH, जैविक पदार्थ और N-P-K।",
          "सिफारिशें — जैविक और रासायनिक उपाय समय सहित।",
        ],
      },
      {
        h: "4. सहेजें और साझा करें",
        p: "PDF रिपोर्ट डाउनलोड करें, या लॉगिन करके Save दबाएँ ताकि यह आपके डैशबोर्ड में सुरक्षित रहे।",
        li: [],
      },
      {
        h: "5. सीमाएँ",
        p: "यह रिपोर्ट सलाह है, प्रयोगशाला परिणाम नहीं। बड़े निर्णय से पहले स्थानीय कृषि विशेषज्ञ से पुष्टि करें।",
        li: [],
      },
    ],
  },
  pt: {
    label: "Portuguese",
    native: "Português",
    intro:
      "O Farmer's AI transforma uma fotografia num relatório agronómico completo. A análise é gratuita e não exige conta; o login serve apenas para guardar o histórico.",
    sections: [
      {
        h: "1. Fotografar a amostra",
        p: "A qualidade da foto define a qualidade do relatório.",
        li: [
          "Fotografe com luz natural, nunca com flash.",
          "Preencha o enquadramento com a amostra e mantenha o telemóvel paralelo.",
          "Em folhas, inclua uma folha saudável para comparação.",
          "No solo, remova a crosta superficial e fotografe a 30 cm.",
          "Em sementes, espalhe mais de 100 sementes numa camada sobre papel branco.",
        ],
      },
      {
        h: "2. Executar a análise",
        p: "Abra Analisar, carregue a foto e acrescente uma nota com cultura, idade e tipo de rega. O resultado demora cerca de quinze segundos.",
        li: [],
      },
      {
        h: "3. Ler o relatório",
        p: "O relatório está dividido em blocos conforme a amostra.",
        li: [
          "Identidade — espécie, variedade e confiança.",
          "Saúde — doenças, pragas e stress com severidade.",
          "Nutrientes — estado de carência por elemento.",
          "Qualidade — Brix, pH, maturação e vida útil.",
          "Solo — textura, pH, matéria orgânica e N-P-K.",
          "Recomendações — soluções orgânicas e convencionais.",
        ],
      },
      {
        h: "4. Guardar e partilhar",
        p: "Descarregue o relatório em PDF ou inicie sessão e clique em Guardar para o manter no painel.",
        li: [],
      },
      {
        h: "5. Limites",
        p: "O relatório é apoio à decisão, não um resultado laboratorial. Confirme decisões importantes com apoio técnico local.",
        li: [],
      },
    ],
  },
  sw: {
    label: "Swahili",
    native: "Kiswahili",
    intro:
      "Farmer's AI hubadilisha picha moja kuwa ripoti kamili ya kilimo. Uchambuzi ni bure na hauhitaji akaunti; kuingia ni kwa ajili ya kuhifadhi historia tu.",
    sections: [
      {
        h: "1. Piga picha ya sampuli",
        p: "Ubora wa picha ndio ubora wa ripoti.",
        li: [
          "Piga picha kwa mwanga wa asili, usitumie flash.",
          "Jaza fremu na sampuli; shika simu kwa utulivu.",
          "Kwa majani, weka jani moja lenye afya kwa kulinganisha.",
          "Kwa udongo, ondoa ganda la juu kisha piga picha kutoka sm 30.",
          "Kwa mbegu, tandaza mbegu zaidi ya 100 kwenye karatasi nyeupe.",
        ],
      },
      {
        h: "2. Fanya uchambuzi",
        p: "Fungua Analyze, pakia picha na andika maelezo ya zao, umri na umwagiliaji. Majibu huchukua sekunde kumi na tano.",
        li: [],
      },
      {
        h: "3. Soma ripoti",
        p: "Ripoti imegawanywa katika sehemu kulingana na sampuli.",
        li: [
          "Utambulisho — aina ya mmea na kiwango cha uhakika.",
          "Afya — magonjwa, wadudu na msongo.",
          "Virutubisho — upungufu wa kila kirutubisho.",
          "Ubora — Brix, pH, ukomavu na muda wa kuhifadhi.",
          "Udongo — muundo, pH, mboji na N-P-K.",
          "Mapendekezo — hatua za kikaboni na za kemikali.",
        ],
      },
      {
        h: "4. Hifadhi na shiriki",
        p: "Pakua ripoti ya PDF, au ingia kisha bonyeza Save ili ihifadhiwe kwenye dashibodi yako.",
        li: [],
      },
      {
        h: "5. Mipaka",
        p: "Ripoti ni msaada wa maamuzi, si matokeo ya maabara. Thibitisha maamuzi makubwa na mtaalamu wa kilimo wa eneo lako.",
        li: [],
      },
    ],
  },
};

const CODES = Object.keys(DOCS);

function Page() {
  const [lang, setLang] = useState("en");
  const doc = DOCS[lang]!;

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="User manual"
        description="How to photograph a sample, read your report and keep a record — available in six languages."
      >
        <div className="flex flex-wrap gap-2">
          {CODES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={c === lang ? "default" : "outline"}
              onClick={() => setLang(c)}
            >
              {DOCS[c]!.native}
            </Button>
          ))}
        </div>
      </PageHero>

      <div className="mx-auto max-w-3xl px-4 py-14" lang={lang}>
        <p className="text-base text-muted-foreground">{doc.intro}</p>
        <div className="mt-8 space-y-4">
          {doc.sections.map((s) => (
            <section key={s.h} className="surface-card p-6">
              <h2 className="text-base font-semibold">{s.h}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.p}</p>
              {s.li.length ? (
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {s.li.map((l) => (
                    <li key={l} className="ml-5 list-disc">
                      {l}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

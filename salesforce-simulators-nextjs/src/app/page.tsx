import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container">
        <h1 className="text-center mt-5">Home Page</h1>
        <div className="text-center mt-4">
          <p className="lead">Bem-vindo ao sistema de simulados para certificações Salesforce</p>
          <p>Escolha uma das opções no menu para começar seus estudos:</p>
          <ul className="list-unstyled mt-4">
            <li className="mb-2">📋 <strong>Administrator</strong> - Simulados para certificação Salesforce Administrator</li>
            <li className="mb-2">🔧 <strong>MCD</strong> - MuleSoft Certified Developer simulados</li>
            <li className="mb-2">🏗️ <strong>MCPA</strong> - MuleSoft Certified Platform Architect simulados</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

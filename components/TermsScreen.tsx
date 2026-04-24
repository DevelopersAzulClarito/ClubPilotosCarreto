import React from 'react';

interface TermsScreenProps {
  onBack?: () => void;
}

export default function TermsScreen({ onBack }: TermsScreenProps) {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6 text-gray-800 dark:text-gray-200">
      <div className="max-w-3xl mx-auto space-y-6 text-sm leading-relaxed">

        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 relative">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2 hover:underline"
            >
              &larr; Volver
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Términos y Condiciones de Uso - Club Pilotos Carreto
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Última actualización: miércoles, 18 de marzo de 2026
          </p>
        </div>

        <section>
          <h2 className="font-bold text-base mb-2">1. ACEPTACIÓN DE LOS TÉRMINOS Y NATURALEZA DEL SERVICIO</h2>
          <p>El presente documento establece los Términos y Condiciones (los "Términos") bajo los cuales Gasolineras Carreto, con domicilio corporativo en Av. Lázaro Cárdenas No. 72, Col. La Haciendita, C.P. 39087, México (en adelante "Carreto"), ofrece el uso de la aplicación móvil "Club Pilotos Carreto" (la "Aplicación"). Al descargar, instalar, registrarse o usar la Aplicación, el usuario (en adelante "Piloto" o "Usuario") acepta de manera expresa, voluntaria e irrevocable sujetarse a estos Términos. La Aplicación es un programa de lealtad comercial y gamificación diseñado exclusivamente para recompensar el consumo de los clientes en las estaciones de servicio físicas de Carreto.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">2. REQUISITOS DE ELEGIBILIDAD Y REGISTRO</h2>
          <div className="space-y-2 pl-4">
            <p><strong>2.1. Capacidad Legal:</strong> El uso de la Aplicación está estrictamente limitado a personas físicas mayores de 18 años con capacidad legal para contratar. Carreto se reserva el derecho de dar de baja cuentas de menores de edad.</p>
            <p><strong>2.2. Cuenta Única e Intransferible:</strong> Cada Usuario podrá registrar una (1) sola cuenta, vinculada a su número telefónico y correo electrónico. El Usuario es el único responsable de la veracidad de los datos proporcionados y de mantener la confidencialidad de sus credenciales.</p>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">3. MECÁNICA DEL PROGRAMA: CHECK-INS Y SISTEMA DUAL DE RECOMPENSAS</h2>
          <p className="mb-2">La Aplicación opera bajo un modelo de recompensas duales basadas en el monto de consumo en combustible. La acumulación se rige por las siguientes reglas:</p>
          <div className="space-y-2 pl-4">
            <p><strong>3.1. Métodos de Check-in:</strong> La acumulación de beneficios se realiza en la estación de servicio mediante dos vías autorizadas al momento de la carga: a) Escaneo del Código QR oficial desde la Aplicación, o b) Ingreso manual de la transacción en el sistema por parte del personal autorizado de Carreto.</p>
            <p><strong>3.2. Tasa de Conversión Base:</strong> Por cada $100.00 MXN (Cien Pesos 00/100 Moneda Nacional) de compra comprobada y registrada mediante el Check-in, el Usuario recibirá simultáneamente dos beneficios distintos:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Un (1) "Punto Carreto"</li>
              <li>Un (1) "Punto de Experiencia" (XP)</li>
            </ul>
            <p><strong>3.3. Naturaleza y Uso de los "Puntos Carreto":</strong> Los Puntos Carreto son un saldo promocional virtual. Podrán ser utilizados por el Usuario exclusivamente como método de pago parcial o total, o para la obtención de descuentos directos en futuras compras de combustible o productos participantes dentro de las estaciones Carreto.</p>
            <p><strong>3.4. Naturaleza y Uso de los "Puntos de Experiencia" (XP):</strong> Los XP son una métrica de gamificación. Podrán ser canjeados exclusivamente por premios, artículos promocionales (merchandising) o beneficios estipulados dentro del catálogo de la Aplicación, así como para subir de "Nivel de Piloto".</p>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">4. RESTRICCIONES LEGALES DE LOS PUNTOS Y XP</h2>
          <div className="space-y-2 pl-4">
            <p><strong>4.1. No son Dinero Electrónico:</strong> Los "Puntos Carreto" y los "XP" son un beneficio comercial promocional propiedad de Carreto. En ningún caso constituyen dinero electrónico regulado por la Ley para Regular las Instituciones de Tecnología Financiera (Ley Fintech).</p>
            <p><strong>4.2. Sin Valor en Efectivo:</strong> Los Puntos Carreto y los XP no son reembolsables, no pueden ser canjeados por dinero en efectivo, no generan intereses, no son transferibles a otras cuentas ni a terceros, y no son heredables.</p>
            <p><strong>4.3. Modificación y Caducidad:</strong> Carreto se reserva el derecho unilateral de modificar la tasa de conversión (monto requerido para generar puntos), los precios del catálogo de premios, así como de establecer fechas de caducidad para los Puntos Carreto y XP acumulados, notificando previamente a los Usuarios a través de la Aplicación con al menos 30 días de anticipación.</p>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">5. POLÍTICA ANTI-FRAUDE (TOLERANCIA CERO)</h2>
          <p className="mb-2">Cualquier intento de manipular el sistema resultará en la cancelación definitiva de la cuenta. Se considera fraude:</p>
          <ul className="list-[lower-alpha] pl-6 space-y-1 mb-2">
            <li>Escanear códigos QR mediante fotografías enviadas por terceros o capturas de pantalla sin estar físicamente presente en la estación.</li>
            <li>Intentar registrar cargas mediante cualquier método distinto al escaneo del código QR oficial autorizado.</li>
            <li>Uso de software no autorizado, emuladores o alteraciones al código de la aplicación para modificar el contador de puntos.</li>
          </ul>
          <p>Carreto se reserva el derecho de auditar los movimientos de cualquier cuenta sospechosa.</p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">6. FALLAS DEL SISTEMA Y LIMITACIÓN DE RESPONSABILIDAD</h2>
          <p className="mb-4">La Aplicación se proporciona "tal cual". Carreto no garantiza que la Aplicación estará libre de errores, interrupciones o que operará en todos los dispositivos móviles. Carreto no asume responsabilidad económica alguna por la imposibilidad de canjear Puntos Carreto o XP, o de realizar Check-ins debido a cortes de internet, mantenimientos del sistema o fallas en los servicios de Google Cloud/Firebase. En caso de discrepancia en los saldos por errores de sincronización, la base de datos central de Carreto será la única fuente de verdad.</p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="font-bold mb-2">Para dudas, aclaraciones o reportes sobre su cuenta, el Usuario puede contactarnos en:</p>
            <p><strong>Teléfono de atención:</strong> +52 747 472 3623</p>
            <p><strong>Correo electrónico:</strong> contacto@carretogas.com.mx</p>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">7. LEGISLACIÓN APLICABLE Y JURISDICCIÓN</h2>
          <p>Para la interpretación y cumplimiento de los presentes Términos, las partes se someten a las leyes aplicables en los Estados Unidos Mexicanos y a la jurisdicción de los tribunales competentes en Chilpancingo, Guerrero, renunciando expresamente a cualquier otro fuero que por razón de sus domicilios presentes o futuros pudiera corresponderles.</p>
        </section>

      </div>
    </div>
  );
}

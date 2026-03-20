import React from 'react';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in touch-none">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Aviso de Privacidad Integral</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 bg-white border border-gray-200 rounded-full hover:bg-gray-100 active:scale-90 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* --- CONTENIDO EXTENDIDO LFPDPPP --- */}
                <div className="overflow-y-auto p-5 sm:p-8 space-y-7 text-sm text-gray-600 pb-10 overscroll-contain">
                    <div>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">En cumplimiento con la LFPDPPP</p>
                        <p className="leading-relaxed text-justify">
                            En estricto apego a lo dispuesto por la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, su Reglamento y los Lineamientos del Aviso de Privacidad, <strong>Carreto Gas</strong> (en lo sucesivo, "El Responsable"), emite el presente Aviso de Privacidad Integral, mediante el cual informa a sus usuarios y clientes (en lo sucesivo "El Titular") sobre el tratamiento, uso, almacenamiento y protección de la información personal proporcionada a través de la aplicación "Club Pilotos Carreto" (en adelante, la "Aplicación").
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">1. Identidad y Domicilio del Responsable</h4>
                        <p className="leading-relaxed text-justify">
                            Carreto Gas, con domicilio comercial en las instalaciones de nuestra estación de servicio, es el ente legalmente responsable de recabar sus datos personales, del uso que se le dé a los mismos y de su debida protección. Para cualquier asunto relacionado con este Aviso, puede dirigirse a nuestras oficinas administrativas.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">2. Datos Personales Recabados</h4>
                        <p className="leading-relaxed text-justify">Para llevar a cabo las finalidades descritas en el presente aviso, recabaremos de manera electrónica (a través del formulario de registro de la Aplicación) los siguientes datos personales de identificación y contacto:</p>
                        <ul className="list-disc pl-5 space-y-1 marker:text-[#136A40] font-medium text-justify">
                            <li>Nombre completo.</li>
                            <li>Número de teléfono celular.</li>
                            <li>Dirección de correo electrónico.</li>
                            <li>Edad (para fines de validación de mayoría de edad).</li>
                            <li>Historial de consumo y transacciones en estaciones (Puntos, montos, frecuencia de visitas).</li>
                            <li>Datos técnicos del dispositivo (exclusivamente para la seguridad y prevención de fraudes en la sesión).</li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-2 text-justify"><em>* <strong>Datos Sensibles:</strong> Se informa expresamente que El Responsable <strong>no recaba datos personales considerados como sensibles</strong> según la Ley (tales como origen racial, estado de salud presente o futuro, información genética, creencias religiosas, filosóficas o morales, afiliación sindical, opiniones políticas o preferencia sexual).</em></p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">3. Finalidades Primarias del Tratamiento (Necesarias)</h4>
                        <p className="leading-relaxed text-justify">Sus datos personales serán utilizados de forma estricta para las siguientes finalidades esenciales, sin las cuales no podríamos prestarle el servicio del Programa de Lealtad:</p>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-[#136A40] leading-relaxed text-justify">
                            <li>Creación, autenticación, gestión y mantenimiento de su perfil de usuario en la plataforma.</li>
                            <li>Registro histórico, control, cálculo y administración de los Puntos y Niveles de lealtad generados por sus consumos.</li>
                            <li>Validación de identidad al momento de solicitar el canje de recompensas o premios en la estación.</li>
                            <li>Otorgamiento de soporte técnico, recuperación de contraseñas, aclaración de saldos y atención a quejas o sugerencias.</li>
                            <li>Cumplimiento de obligaciones administrativas, legales y de seguridad informática internas.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">4. Finalidades Secundarias (Accesorias)</h4>
                        <p className="leading-relaxed text-justify">De manera adicional, si el Titular no manifiesta su negativa, utilizaremos su información para las siguientes finalidades accesorias que nos permiten brindarle una atención personalizada y mejorar nuestros servicios:</p>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-[#136A40] leading-relaxed text-justify">
                            <li>Envío de comunicaciones de marketing, publicidad, promociones especiales y boletines informativos vinculados exclusivamente a Carreto Gas.</li>
                            <li>Elaboración de perfilamiento comercial, encuestas de satisfacción y análisis de hábitos de consumo.</li>
                        </ul>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-3">
                            <p className="leading-relaxed text-[11px] text-gray-600 text-justify"><strong>Mecanismo para manifestar negativa:</strong> En caso de que no desee que sus datos personales se utilicen para estas finalidades secundarias, usted cuenta con un plazo de <strong>5 (cinco) días hábiles</strong> posteriores a su registro para enviar una solicitud por escrito a la administración de la estación indicando su negativa. La negativa para el uso de sus datos personales para estas finalidades no será motivo para que le neguemos los servicios principales de la Aplicación.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">5. Transferencia de Datos Personales</h4>
                        <p className="leading-relaxed text-justify">
                            El Responsable se compromete a que sus datos personales <strong>no serán vendidos, alquilados ni transferidos comercialmente a terceros</strong> bajo ninguna circunstancia. 
                            Sus datos únicamente podrán ser compartidos en los siguientes escenarios excepcionales amparados por la Ley:
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-[#136A40] leading-relaxed text-justify mt-1">
                            <li>Con proveedores de infraestructura tecnológica (proveedores de alojamiento en la nube, servidores y bases de datos, ej. Google Cloud/Firebase) que nos asisten en la operatividad de la Aplicación, quienes asumen el rol de "Encargados" y están obligados por contrato a mantener el mismo nivel de protección jurídica.</li>
                            <li>Cuando la transferencia sea legalmente exigida para la salvaguarda de un interés público, o para la procuración o administración de justicia por parte de autoridades fiscales o judiciales competentes, previa orden formal y fundamentada.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">6. Ejercicio de los Derechos ARCO</h4>
                        <p className="leading-relaxed text-justify">
                            Usted tiene, en todo momento, el derecho de conocer qué datos personales tenemos de usted (<strong>A</strong>cceso); solicitar la corrección de su información personal en caso de estar desactualizada, ser inexacta o incompleta (<strong>R</strong>ectificación); solicitar que la eliminemos de nuestros registros si considera que no se utiliza conforme a los principios, deberes y obligaciones previstos en la normativa (<strong>C</strong>ancelación); y oponerse al uso de sus datos para fines específicos (<strong>O</strong>posición).
                        </p>
                        <p className="leading-relaxed text-justify mt-2">
                            Para el ejercicio de cualquiera de los Derechos ARCO, el Titular deberá presentar una <strong>Solicitud de Derechos ARCO</strong> de manera presencial, mediante escrito libre, en la administración de la estación Carreto Gas. Dicha solicitud deberá contener:
                        </p>
                        <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-600 mt-2 text-justify font-medium">
                            <li>El nombre completo del Titular y domicilio u otro medio para comunicarle la respuesta.</li>
                            <li>Los documentos oficiales vigentes que acrediten su identidad (INE, Pasaporte) o, en su caso, la representación legal.</li>
                            <li>La descripción clara y precisa de los datos personales respecto de los que se busca ejercer alguno de los derechos.</li>
                            <li>Cualquier otro elemento o documento que facilite la localización de los datos personales (ej. Número de cliente o ID de la App).</li>
                        </ol>
                        <p className="leading-relaxed text-[11px] mt-2 text-gray-500 text-justify"><strong>Plazos de respuesta:</strong> El Responsable comunicará al Titular, en un plazo máximo de <strong>20 (veinte) días hábiles</strong> contados desde la fecha de recepción de la solicitud, la determinación adoptada. De resultar procedente, se hará efectiva dentro de los 15 (quince) días hábiles siguientes a la fecha en que se comunique la respuesta.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">7. Uso de Tecnologías de Rastreo (Cookies)</h4>
                        <p className="leading-relaxed text-justify">
                            Le informamos que en nuestra Aplicación utilizamos <em>tokens de sesión</em> y almacenamiento local (<em>local storage</em>) exclusivamente para mantener su sesión activa, recordar sus credenciales de acceso de forma segura y garantizar el correcto funcionamiento técnico de la plataforma. Estas tecnologías no extraen información de otras aplicaciones en su dispositivo. Usted puede borrar el caché de la aplicación o cerrar su sesión en cualquier momento para eliminar estos registros de su dispositivo.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">8. Modificaciones al Aviso de Privacidad</h4>
                        <p className="leading-relaxed text-justify">
                            El presente Aviso de Privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales, modificaciones en nuestro modelo de negocio, o de nuestras propias prácticas de privacidad. 
                            Nos comprometemos a mantenerlo informado sobre dichos cambios, poniendo a su disposición la versión actualizada en todo momento dentro de la Aplicación, en la sección de "Mi Perfil" o "Términos y Privacidad".
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">9. Autoridad Competente (INAI)</h4>
                        <p className="leading-relaxed text-justify">
                            Si usted, como Titular, considera que su derecho a la protección de sus datos personales ha sido lesionado por alguna conducta, actuación u omisión de nuestra parte, o presume que existe alguna violación a las disposiciones previstas en la LFPDPPP, podrá interponer la queja o denuncia correspondiente ante el <strong>Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)</strong>. Para mayor información, le sugerimos visitar su página oficial de Internet: www.inai.org.mx.
                        </p>
                    </div>
                </div>

                {/* --- FOOTER DEL MODAL --- */}
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0">
                    <p className="text-[10px] text-gray-400 mb-3 px-2 leading-tight text-center">La continuidad en el registro y uso de la Aplicación implica su consentimiento tácito y expreso con los términos de este Aviso.</p>
                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
                    >
                        He leído y comprendo el Aviso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyModal;
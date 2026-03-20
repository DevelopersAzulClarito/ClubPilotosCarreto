import React from 'react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in touch-none">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                
                {/* --- HEADER --- */}
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Términos y Condiciones</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 bg-white border border-gray-200 rounded-full hover:bg-gray-100 active:scale-90 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* --- CONTENIDO EXTENDIDO PARA PRODUCCIÓN --- */}
                <div className="overflow-y-auto p-5 sm:p-8 space-y-7 text-sm text-gray-600 pb-10 overscroll-contain">
                    <div>
                        <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px] mb-2">Fecha de Entrada en Vigor: Marzo 2026</p>
                        <p className="leading-relaxed text-justify">
                            El presente documento establece los Términos y Condiciones Generales de Uso (en adelante, los "Términos") que regulan el acceso, registro y uso de la aplicación móvil y web denominada <strong>"Club Pilotos Carreto"</strong> (en adelante, la "Aplicación" o el "Programa"), operada por <strong>Carreto Gas</strong> (en adelante, "El Operador").
                            Al registrar una cuenta y acceder a la Aplicación, usted (en adelante, el "Usuario" o "Piloto") reconoce haber leído, entendido y aceptado incondicionalmente el contenido íntegro de este documento. Si no está de acuerdo con estos Términos, deberá abstenerse de utilizar la Aplicación.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">1. Objeto del Programa</h4>
                        <p className="leading-relaxed text-justify">El Programa tiene como objetivo principal premiar la lealtad y preferencia de los clientes de El Operador. A través del uso de la Aplicación, el Usuario podrá acumular Puntos por las transacciones de carga de combustible que realice en las estaciones de servicio participantes, así como redimir dichos Puntos por los productos, descuentos o beneficios disponibles en el catálogo vigente.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">2. Capacidad Legal y Elegibilidad</h4>
                        <ul className="list-disc pl-5 space-y-2 marker:text-[#e35212] leading-relaxed text-justify">
                            <li>El uso del Programa está reservado exclusivamente para personas físicas, mayores de 18 (dieciocho) años de edad, que cuenten con plena capacidad jurídica para celebrar contratos conforme a la legislación de los Estados Unidos Mexicanos.</li>
                            <li>No podrán participar en el Programa los empleados directos de El Operador en horario laboral, salvo autorización expresa y por escrito de la gerencia.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">3. Creación y Seguridad de la Cuenta</h4>
                        <ul className="list-disc pl-5 space-y-2 marker:text-[#e35212] leading-relaxed text-justify">
                            <li>El Usuario deberá proporcionar información exacta, precisa y verdadera (Nombre, Celular, Correo, Edad) y asume el compromiso de actualizar sus datos cuando resulte necesario.</li>
                            <li>La cuenta es <strong>estrictamente personal, única e intransferible</strong>. El Usuario será el único responsable de todas las operaciones efectuadas en su cuenta, pues el acceso a la misma está restringido al uso de sus credenciales de seguridad (correo/celular y contraseña).</li>
                            <li>Queda prohibida la venta, cesión, fusión, donación o transferencia de la cuenta o de los Puntos acumulados bajo cualquier título.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">4. Mecánica de Acumulación y Naturaleza de los Puntos</h4>
                        <ul className="list-disc pl-5 space-y-2 marker:text-[#e35212] leading-relaxed text-justify">
                            <li>Para la acumulación exitosa, el Usuario <strong>debe presentar indefectiblemente su Pase Digital (Código QR)</strong> al personal despachador de la estación <strong>antes o durante</strong> el suministro de combustible.</li>
                            <li><strong>Limitación:</strong> El Operador se reserva el derecho de establecer límites máximos diarios de acumulación de puntos o transacciones permitidas por Usuario para prevenir prácticas abusivas.</li>
                            <li><strong>Cargas Retroactivas:</strong> Por razones operativas y de control fiscal, <strong>no se realizarán abonos de puntos retroactivos</strong>. Si el Usuario olvida presentar su código antes de emitirse el ticket o factura de compra, perderá el derecho a los Puntos de esa transacción.</li>
                            <li><strong>Valor Nulo:</strong> Los Puntos acumulados <strong>no son moneda de curso legal</strong>, no constituyen propiedad del Usuario, no devengan intereses y <strong>no pueden ser canjeados por dinero en efectivo</strong>, reembolsos o aplicarse al pago de deudas de crédito.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">5. Catálogo, Niveles y Canje de Recompensas</h4>
                        <ul className="list-disc pl-5 space-y-2 marker:text-[#e35212] leading-relaxed text-justify">
                            <li>Todas las recompensas mostradas (físicas o digitales) están estrictamente sujetas a <strong>disponibilidad de inventario</strong> en cada estación participante al momento de la redención.</li>
                            <li>El Operador podrá modificar libremente el catálogo, agregar o retirar premios, así como modificar la cantidad de Puntos necesarios para obtener una recompensa o para alcanzar un nuevo Nivel, sin necesidad de notificación previa.</li>
                            <li>Las promociones temporales contarán con vigencia limitada. Una vez concluido el plazo, desaparecerán de la Aplicación y no podrán ser exigidas.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">6. Vigencia y Expiración de Puntos</h4>
                        <p className="leading-relaxed text-justify">
                            Con el objetivo de mantener la dinámica del programa, los Puntos otorgados tendrán una vigencia de <strong>12 (doce) meses calendario</strong> contados a partir de su fecha de emisión. Adicionalmente, si el Usuario mantiene su cuenta inactiva (sin registrar acumulaciones ni canjes) por un periodo ininterrumpido de <strong>6 (seis) meses</strong>, El Operador procederá a la cancelación y puesta a cero (0) de todos los Puntos acumulados en la cuenta, sin derecho a reclamo o restitución.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">7. Causales de Suspensión y Baja Definitiva</h4>
                        <p className="leading-relaxed text-justify">El Operador se reserva el derecho irrestricto de suspender temporalmente o cancelar definitivamente la cuenta de un Usuario, anulando todos sus Puntos, en los siguientes casos de fraude o uso indebido:</p>
                        <ul className="list-disc pl-5 space-y-1.5 marker:text-[#e35212] leading-relaxed text-justify mt-2">
                            <li>Uso de identidades falsas o creación de múltiples cuentas por un mismo individuo.</li>
                            <li>Clonación, captura de pantalla o alteración técnica del Código QR.</li>
                            <li>Colusión comprobada o sospecha razonable de acuerdos con empleados de El Operador para cargar puntos de transacciones de terceros a la cuenta del Usuario.</li>
                            <li>Cualquier acción que atente contra el software, los servidores o la seguridad informática de la Aplicación.</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">8. Propiedad Intelectual</h4>
                        <p className="leading-relaxed text-justify">Todos los derechos de propiedad intelectual, marcas, logotipos, diseños, código fuente, bases de datos y contenidos de la Aplicación son propiedad exclusiva de El Operador o de sus respectivos licenciantes. El uso de la Aplicación no otorga al Usuario ningún derecho o licencia sobre dichos elementos, más allá del uso personal de la plataforma.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">9. Limitación de Responsabilidad</h4>
                        <p className="leading-relaxed text-justify">El Operador no garantiza el acceso y uso ininterrumpido de la Aplicación. El sistema puede eventualmente no estar disponible debido a fallas en servidores, problemas de conectividad a Internet de terceros o mantenimientos técnicos. En dichos casos, El Operador no será responsable por Puntos no acumulados o recompensas no canjeadas durante el tiempo de inactividad técnica.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">10. Modificaciones al Programa</h4>
                        <p className="leading-relaxed text-justify">El Operador se reserva el derecho de modificar unilateralmente los presentes Términos, el esquema operativo del Programa o, en su caso, dar por terminado el "Club Pilotos Carreto". En caso de cierre del programa, El Operador otorgará un plazo de 30 (treinta) días naturales mediante anuncio en la Aplicación para que los Usuarios puedan canjear los Puntos vigentes. Concluido dicho plazo, los Puntos restantes quedarán automáticamente anulados.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-black text-gray-900 text-sm">11. Jurisdicción y Ley Aplicable</h4>
                        <p className="leading-relaxed text-justify">Para la interpretación, cumplimiento y ejecución de los presentes Términos, las partes se someten a las leyes vigentes de los Estados Unidos Mexicanos, y a la jurisdicción de los tribunales competentes de la ciudad donde se ubica el domicilio fiscal de El Operador, renunciando a cualquier otro fuero que pudiera corresponderles en razón de sus domicilios presentes o futuros.</p>
                    </div>

                </div>

                {/* --- FOOTER DEL MODAL --- */}
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0">
                    <p className="text-[10px] text-gray-400 mb-3 px-2 leading-tight text-center">Al registrarse, declara haber leído, comprendido y aceptado la fuerza vinculante de este documento.</p>
                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-gray-800 active:scale-95 transition-all duration-300"
                    >
                        He leído y acepto los Términos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
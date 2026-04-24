import React, { useEffect } from 'react';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-end"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md h-[93dvh] bg-white rounded-t-[2rem] flex flex-col shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Cabecera */}
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-1 bg-gray-200 rounded-full absolute top-5 left-1/2 -translate-x-1/2"></div>
                        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-3">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="mt-3">
                            <h2 className="text-base font-black text-gray-900 leading-tight">Aviso de Privacidad</h2>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Club Pilotos Carreto</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:scale-90 transition-all shrink-0"
                        aria-label="Cerrar"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido con scroll */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <div className="p-6 text-gray-800 space-y-6 text-sm leading-relaxed">

                        <div className="border-b border-gray-100 pb-4">
                            <h1 className="text-xl font-bold text-gray-900 mb-1">Aviso de Privacidad Integral</h1>
                            <p className="text-gray-500 text-xs">Última actualización: Abril de 2026</p>
                        </div>

                        <p>
                            En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (la "Ley"), <strong>Gasolineras Carreto</strong>, con domicilio en Av. Lázaro Cárdenas No. 72, Col. La Haciendita, C.P. 39087, es el responsable del tratamiento y protección de sus datos personales.
                        </p>

                        <section>
                            <h2 className="font-bold text-base mb-2">1. DATOS PERSONALES QUE RECABAMOS</h2>
                            <p className="mb-2">Para operar la aplicación "Club Pilotos Carreto", recabamos los siguientes datos personales:</p>
                            <ul className="list-disc pl-6 space-y-1 mb-3">
                                <li><strong>Datos de Identificación y Contacto:</strong> Nombre completo, edad, correo electrónico y número de teléfono celular.</li>
                                <li><strong>Datos de Uso y Gamificación:</strong> Historial de "Check-ins" (registro manual o por QR), Puntos Carreto, XP obtenidos y nivel de usuario.</li>
                                <li><strong>Datos Técnicos:</strong> Modelo del dispositivo y tokens de notificaciones push.</li>
                            </ul>
                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-medium">
                                <strong>Aviso importante:</strong> La Aplicación NO recaba ni rastrea su ubicación geográfica (GPS). Tampoco recaba datos financieros o sensibles.
                            </div>
                        </section>

                        <section>
                            <h2 className="font-bold text-base mb-2">2. FINALIDADES DEL TRATAMIENTO</h2>
                            <p className="mb-2">Sus datos serán utilizados para las siguientes <strong>finalidades principales</strong>:</p>
                            <ol className="list-decimal pl-6 space-y-1 mb-4">
                                <li>Crear y administrar su cuenta de "Piloto".</li>
                                <li>Registrar y validar sus consumos (Check-ins por QR o manual) para otorgar Puntos Carreto y XP.</li>
                                <li>Identificar y prevenir fraudes en el sistema de recompensas.</li>
                                <li>Brindar soporte técnico y enviar notificaciones operativas.</li>
                            </ol>
                            <p className="mb-2"><strong>Finalidades secundarias:</strong></p>
                            <ul className="list-disc pl-6 space-y-1">
                                <li>Envío de promociones exclusivas y comunicaciones de marketing.</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">Si no desea que sus datos se usen para finalidades secundarias, puede indicarlo a nuestro correo de contacto.</p>
                        </section>

                        <section>
                            <h2 className="font-bold text-base mb-2">3. TRANSFERENCIA DE DATOS Y TERCEROS</h2>
                            <p>Sus datos son almacenados y procesados de manera segura utilizando infraestructura en la nube de proveedores tecnológicos (como Firebase/Google Cloud) estrictamente para el funcionamiento de la App. Gasolineras Carreto no vende, renta ni transfiere su información a terceros para fines ajenos al servicio.</p>
                        </section>

                        <section>
                            <h2 className="font-bold text-base mb-2">4. ELIMINACIÓN DE CUENTA Y DATOS (DATA SAFETY)</h2>
                            <p className="mb-2">Usted puede solicitar la eliminación total y definitiva de su cuenta, así como de todo su progreso y puntos asociados, en cualquier momento:</p>
                            <ol className="list-decimal pl-6 space-y-1 mb-2">
                                <li><strong>Desde la Aplicación:</strong> Perfil &rarr; Eliminar mi Cuenta.</li>
                                <li><strong>Por Correo Electrónico:</strong> contacto@carretogas.com.mx</li>
                            </ol>
                            <p>Sus datos serán eliminados en un plazo máximo de 14 días hábiles, conservando únicamente registros anonimizados si la ley fiscal lo requiere.</p>
                        </section>

                        <section>
                            <h2 className="font-bold text-base mb-2">5. EJERCICIO DE DERECHOS ARCO</h2>
                            <p className="mb-3">Para Acceder, Rectificar, Cancelar u Oponerse al uso de sus datos, contáctenos:</p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1.5">
                                <p><strong>Correo:</strong> contacto@carretogas.com.mx</p>
                                <p><strong>Teléfono:</strong> +52 747 472 3623</p>
                                <p><strong>Dirección:</strong> Av. Lázaro Cárdenas No. 72, Col. La Haciendita, C.P. 39087.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-bold text-base mb-2">6. MODIFICACIONES</h2>
                            <p>El Responsable se reserva el derecho de efectuar modificaciones a este Aviso de Privacidad. Cualquier cambio será notificado a través de la Aplicación.</p>
                        </section>

                    </div>
                </div>

                {/* Pie */}
                <div className="px-5 py-4 border-t border-gray-100 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 active:scale-95 transition-all"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyModal;

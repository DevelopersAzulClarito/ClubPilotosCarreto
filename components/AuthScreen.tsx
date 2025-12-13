
import React, { useState } from 'react';

interface AuthScreenProps {
    onLogin: (phone: string) => void;
    onRegister: (userInfo: { name: string; phone: string; email: string; age: string }) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    
    // Login state
    const [phoneLogin, setPhoneLogin] = useState('');

    // Register state
    const [name, setName] = useState('');
    const [phoneRegister, setPhoneRegister] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneLogin) {
            onLogin(phoneLogin);
        }
    };
    
    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && phoneRegister && email && age) {
            onRegister({ name, phone: phoneRegister, email, age });
        }
    };

    const inputClasses = "w-full bg-gray-100 border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition";

    return (
        <div className="p-6">
            <div className="flex border-b-2 border-gray-200 mb-6">
                <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 font-bold text-center transition ${isLogin ? 'text-[#e35212] border-b-2 border-[#e35212]' : 'text-gray-500'}`}
                >
                    Soy Cliente
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 font-bold text-center transition ${!isLogin ? 'text-[#e35212] border-b-2 border-[#e35212]' : 'text-gray-500'}`}
                >
                    Unirme al Club
                </button>
            </div>

            {isLogin ? (
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <h2 className="text-xl font-bold text-center text-gray-900">Iniciar Sesión</h2>
                    <div>
                        <label htmlFor="phone-login" className="block text-sm font-medium text-gray-700 mb-2">Número de Teléfono</label>
                        <input type="tel" id="phone-login" value={phoneLogin} onChange={e => setPhoneLogin(e.target.value)} className={inputClasses} placeholder="123-456-7890" required />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#e35212] text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                    >
                        Entrar
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-center text-gray-900">Crear Cuenta</h2>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="phone-register" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input type="tel" id="phone-register" value={phoneRegister} onChange={e => setPhoneRegister(e.target.value)} className={inputClasses} required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} required />
                    </div>
                     <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                        <input type="number" id="age" value={age} onChange={e => setAge(e.target.value)} className={inputClasses} required />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#e35212] text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 mt-4"
                    >
                        Registrarme
                    </button>
                </form>
            )}
        </div>
    );
};

export default AuthScreen;
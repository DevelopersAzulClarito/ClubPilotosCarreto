import React, { Component, ErrorInfo } from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[100dvh] bg-[#F4F5F7] flex items-center justify-center p-6">
                    <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-xl p-8 flex flex-col items-center text-center gap-5">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">
                                Algo salió mal
                            </h2>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                La app encontró un error inesperado. Por favor recarga para continuar.
                            </p>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gradient-to-r from-[#e35212] to-[#ff7438] text-white font-black py-4 rounded-2xl text-base shadow-lg shadow-orange-500/25 active:scale-[0.97] transition-transform"
                        >
                            Recargar la app
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

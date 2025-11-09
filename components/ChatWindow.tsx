import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import PlanTable from './PlanTable';
import type { Message, UserData } from '../types';
import { ConversationStep } from '../types';

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userData, setUserData] = useState<UserData>({
        name: '', phone: '', email: '', planType: null, age: '', hasPreviousPlan: null, dependents: ''
    });
    const [step, setStep] = useState<ConversationStep>(ConversationStep.GREETING);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const resetChat = (delay: number) => {
        setTimeout(() => {
            setMessages([]);
            setUserData({
                name: '', phone: '', email: '', planType: null, age: '', hasPreviousPlan: null, dependents: ''
            });
            setStep(ConversationStep.GREETING);
        }, delay);
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if (step === ConversationStep.GREETING) {
            addBotMessage("Olá! 👋 Sou o Assistente Virtual da DCG Corretora de Seguros. <br><br> Vi que você se interessou pela <strong>BLACK FRIDAY MEDSENIOR</strong> com até 80% de DESCONTO! 🔥<br><br>A promoção está PRORROGADA até 30/NOVEMBRO/2025! ✅<br><br>Me diga: qual o seu nome para eu personalizar seu atendimento?", 500);
            setStep(ConversationStep.GET_NAME);
        }
    }, [step]);
    
    const addBotMessage = (
        text?: string,
        delay = 1000,
        component?: React.ReactNode,
        options?: string[],
        inputType?: 'text' | 'tel' | 'email' | 'number',
        validation?: (input: string) => boolean,
        errorMessage?: string
    ) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'bot',
                text,
                component,
                options,
                inputType,
                validation,
                errorMessage,
             }]);
            setIsTyping(false);
        }, delay);
    };

    const handleUserSend = (text: string) => {
        const userMessage: Message = { id: Date.now(), sender: 'user', text };
        setMessages(prev => [...prev, userMessage]);

        processUserInput(text);
    };

    const processUserInput = (input: string) => {
        switch (step) {
            case ConversationStep.GET_NAME:
                setUserData(prev => ({...prev, name: input}));
                addBotMessage(`Prazer, ${input}! 😊<br><br>Para eu preparar a melhor proposta para você, preciso de alguns dados rápidos:<br><br>Qual o seu melhor <strong>telefone</strong> para contato?`);
                setStep(ConversationStep.GET_PHONE);
                break;
            case ConversationStep.GET_PHONE:
                setUserData(prev => ({...prev, phone: input}));
                const emailValidation = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                addBotMessage(
                    `Obrigado. E seu <strong>e-mail</strong> para enviar a proposta detalhada?`,
                    1000,
                    undefined,
                    undefined,
                    'email',
                    emailValidation,
                    'Hmm, parece que este não é um e-mail válido. Por favor, digite um e-mail no formato `nome@exemplo.com`.'
                );
                setStep(ConversationStep.GET_EMAIL);
                break;
            case ConversationStep.GET_EMAIL:
                const promptingMessage = messages.slice().reverse().find(m => m.sender === 'bot' && m.validation);
                if (promptingMessage?.validation && !promptingMessage.validation(input)) {
                    addBotMessage(promptingMessage.errorMessage || 'Formato de e-mail inválido. Por favor, tente novamente.', 500);
                } else {
                    setUserData(prev => ({...prev, email: input}));
                    addBotMessage(`Perfeito! Agora me ajuda a entender sua necessidade:<br><br>Você procura plano:`, 1000, undefined, ["👔 Empresarial (PME)", "👨‍👩‍👧‍👦 Individual/Familiar"]);
                    setStep(ConversationStep.GET_PLAN_TYPE);
                }
                break;
            case ConversationStep.GET_PLAN_TYPE:
                const planType = input.includes('Empresarial') ? 'PME' : 'Individual/Familiar';
                setUserData(prev => ({...prev, planType}));
                addBotMessage(`Entendido. Qual a sua idade? (ou a idade do titular se for familiar)`);
                setStep(ConversationStep.GET_AGE);
                break;
            case ConversationStep.GET_AGE:
                 setUserData(prev => ({ ...prev, age: input }));
                 if (userData.planType === 'PME' || userData.planType === 'Individual/Familiar') {
                    addBotMessage(`Tem dependentes?`, 1000, undefined, ['Sim', 'Não']);
                    setStep(ConversationStep.GET_DEPENDENTS_PROMPT);
                } else {
                    addBotMessage(`Você possui plano de saúde atualmente?`, 1000, undefined, ["Sim, quero migrar", "Não tenho plano"]);
                    setStep(ConversationStep.GET_PREVIOUS_PLAN);
                }
                break;
            case ConversationStep.GET_DEPENDENTS_PROMPT:
                if (input === 'Sim') {
                    addBotMessage(`Quais as idades dos dependentes? (separe por vírgula)`);
                    setStep(ConversationStep.GET_DEPENDENTS_AGE);
                } else {
                    addBotMessage(`Você possui plano de saúde atualmente?`, 1000, undefined, ["Sim, quero migrar", "Não tenho plano"]);
                    setStep(ConversationStep.GET_PREVIOUS_PLAN);
                }
                break;
             case ConversationStep.GET_DEPENDENTS_AGE:
                setUserData(prev => ({ ...prev, dependents: input }));
                addBotMessage(`Você possui plano de saúde atualmente?`, 1000, undefined, ["Sim, quero migrar", "Não tenho plano"]);
                setStep(ConversationStep.GET_PREVIOUS_PLAN);
                break;
            case ConversationStep.GET_PREVIOUS_PLAN:
                const hasPlan = input.includes('Sim') ? 'Sim' : 'Não';
                setUserData(prev => ({...prev, hasPreviousPlan: hasPlan}));
                addBotMessage(`Ok, estou preparando as informações dos planos para você...`);
                showPlanOptions();
                setStep(ConversationStep.SHOW_PLANS);
                break;
             case ConversationStep.NEXT_STEP:
                 if(input.includes("Falar com o Diniz")) {
                    const whatsappLink = `https://wa.me/5511994104891?text=${encodeURIComponent(`Olá Diniz, meu nome é ${userData.name} e gostaria de falar sobre o plano MedSenior.`)}`;
                    addBotMessage(`Ótimo! Para falar com o Diniz, clique no link abaixo. Ele já está esperando seu contato!<br><br><a href="${whatsappLink}" target="_blank" class="text-blue-500 font-bold underline">Clique aqui para falar com Diniz no WhatsApp</a>`);
                    addBotMessage("Agradeço o seu contato! Se precisar de mais alguma coisa, estarei por aqui. Esta conversa será reiniciada em instantes.", 1500);
                    resetChat(5000);
                    setStep(ConversationStep.END);
                 } else if (input.includes("Quero que o Diniz me ligue")) {
                     addBotMessage(`Perfeito! Vou agendar seu contato personalizado com o Diniz. 📅<br><br>Seu contato foi agendado! O Diniz vai entrar em contato em até <strong>2 horas úteis</strong> no telefone que você forneceu (${userData.phone}). 📱`);
                     addBotMessage("Obrigado pelo seu tempo! Esta conversa será reiniciada em instantes.", 1500);
                     resetChat(5000);
                     setStep(ConversationStep.END);
                 }
                 break;
            default:
                addBotMessage("Não entendi. Poderia repetir?");
        }
    };
    
    const showPlanOptions = () => {
        const pmePlans = {
            title: "💼 PLANOS EMPRESARIAIS MEDSENIOR",
            plans: [
                { name: "📋 CORPORATE SP1", age44_48: "R$ 810,73", age59plus: "R$ 1.274,47", details: "Enfermaria" },
                { name: "🏨 CORPORATE SP2", age44_48: "R$ 972,88", age59plus: "R$ 1.529,37", details: "Apartamento" },
                { name: "⭐ PRETO CORPORATIVO", age44_48: "R$ 1.085,34", age59plus: "R$ 1.706,16", details: "Premium" },
                { name: "💎 INFINITE", age44_48: "R$ 1.487,70", age59plus: "R$ 2.338,66", details: "Top Nacional" },
            ],
            hospitals: ["Hospital Alemão Oswaldo Cruz", "Hospital 9 de Julho", "Hospital São Camilo (3 unidades)", "Beneficência Portuguesa", "Hospital Santa Catarina", "Hospital Samaritano"],
            labs: ["Hermes Pardini", "Sabin", "CDB", "Labi", "Campana", "DMS Burnier"]
        };

        const individualPlans = {
            title: "👨‍👩‍👧‍👦 PLANOS INDIVIDUAIS MEDSENIOR",
            plans: [
                { name: "📋 ESSENCIAL", age44_48: "R$ 753,23", age59plus: "R$ 1.184,08", details: "Enfermaria - SP Capital" },
                { name: "📋 SP1", age44_48: "R$ 900,82", age59plus: "R$ 1.416,08", details: "Enfermaria Premium" },
                { name: "🏨 SP2", age44_48: "R$ 1.045,53", age59plus: "R$ 1.643,58", details: "Apartamento - Grande SP" },
                { name: "⭐ BLACK 5", age44_48: "R$ 1.205,92", age59plus: "R$ 1.895,70", details: "Premium Nacional" },
                { name: "💎 INFINITE", age44_48: "R$ 1.653,00", age59plus: "R$ 2.598,52", details: "Top Nacional" },
            ],
            hospitals: ["Hospital Adventista - Aclimação", "Hospital Santa Virgínia", "Hospital Santa Marcelina Itaquera", "Hospital Sepaco", "Hospital Presidente", "Hospital Metropolitano Lapa"],
            labs: ["Campana", "Analin", "Cardiológica", "Labi", "Exame Brasil"]
        };

        const plansToShow = userData.planType === 'PME' ? pmePlans : individualPlans;
        
        addBotMessage(undefined, 1500, <PlanTable {...plansToShow} />);
        
        setTimeout(() => {
            addBotMessage(`
<strong>🔥 PROMOÇÃO BLACK FRIDAY 🔥</strong><br>
💥 ATÉ <strong>80% DE DESCONTO</strong> TOTAL:<br>
• 50% OFF na 1ª mensalidade<br>
• 10% OFF na 2ª mensalidade<br>
• 10% OFF na 3ª mensalidade<br>
• 10% OFF na 4ª mensalidade<br><br>

⚡ <strong>CARÊNCIA ZERO:</strong><br>
✅ PME: para TODOS, mesmo sem plano anterior<br>
✅ Individual: com plano anterior (qualquer tempo)<br><br>

⏰ VÁLIDO ATÉ: 30/NOVEMBRO/2025`);
        }, 3000);
        
        setTimeout(() => {
            addBotMessage(`
<strong>✨ DIFERENCIAIS MEDSENIOR ✨</strong><br>
✅ Rede credenciada premium<br>
✅ Sem limite de consultas<br>
✅ Cobertura nacional (Preto/Infinito)<br>
✅ 100% regulamentado ANS<br>
✅ Atendimento humanizado<br>
✅ 15+ anos de experiência<br>
`);
        }, 4500);

        setTimeout(() => {
            addBotMessage(`O que você prefere agora? 🤔`, 1000, undefined, ["Falar com o Diniz agora", "Quero que o Diniz me ligue"]);
            setStep(ConversationStep.NEXT_STEP);
        }, 6000);
    }
    
    const getActiveMessage = () => {
        if(isTyping) return null;
        return messages[messages.length - 1];
    }

    return (
        <div className="flex flex-col flex-auto h-[90vh] max-h-[700px] w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <Header />
            <div className="flex flex-col flex-auto flex-shrink-0 h-full p-4 overflow-y-auto">
                <div className="flex flex-col h-full">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isTyping && (
                        <div className="flex justify-start my-2">
                             <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-r-xl rounded-bl-xl flex items-center space-x-1">
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <InputBar onSend={handleUserSend} activeMessage={getActiveMessage()} isTyping={isTyping} />
        </div>
    );
};

export default ChatWindow;
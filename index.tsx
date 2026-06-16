// index.tsx
import { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Função utilitária para garantir que os números sempre tenham 2 dígitos (ex: 02 em vez de 2)
function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function CronometroApp() {
  /* 1. GERENCIAMENTO DE ESTADO (useState) - Requisito da Atividade
    - tempo: armazena a contagem total em centésimos de segundo
    - rodando: booleano para saber se o cronômetro está ativo ou pausado
    - voltas: array que armazena os históricos de tempos marcados
  */
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [voltas, setVoltas] = useState<number[]>([]);

  /* 2. CONTROLE DE INTERVALO COM useRef - Requisito da Atividade
    O useRef guarda a referência do setInterval. Isso permite limpar e parar o tempo 
    de qualquer lugar do código sem forçar uma nova renderização desnecessária da tela.
  */
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cálculos matemáticos para converter a contagem bruta em Minutos, Segundos e Centésimos
  const minutos = Math.floor(tempo / 6000);
  const segundos = Math.floor((tempo % 6000) / 100);
  const centesimos = tempo % 100;

  /* 3. CONTROLE DE INTERVALOS DE TEMPO (setInterval / clearInterval)
    Função responsável por Alternar entre Iniciar, Pausar e Continuar a contagem
  */
  const handleIniciarPausar = () => {
    if (rodando) {
      // Se já estava rodando, pausa limpando o intervalo ativo
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      setRodando(false);
    } else {
      // Se estava parado, inicia o setInterval disparando a cada 10 milissegundos (1 centésimo)
      intervaloRef.current = setInterval(() => {
        setTempo((t) => t + 1);
      }, 10);
      setRodando(true);
    }
  };

  // Função para salvar uma marcação de tempo (Volta) no array do estado
  const handleVolta = () => {
    if (rodando || tempo > 0) {
      setVoltas((v) => [tempo, ...v]); // Adiciona a nova volta no topo da lista
    }
  };

  // Função para zerar o cronômetro por completo e limpar o histórico
  const handleReset = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    setRodando(false);
    setTempo(0);
    setVoltas([]);
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      {/* Moldura simulando o celular na Web */}
      <View style={styles.phoneFrame}>
        <View style={styles.phoneScreen}>

          {/* Título personalizado */}
          <Text style={styles.title}>CRONÔMETRO PRO</Text>

          {/* Display do tempo formatado em MM:SS.cc */}
          <View style={styles.displayContainer}>
            <Text style={styles.displayTempo}>
              {pad(minutos)}:{pad(segundos)}
            </Text>
            <Text style={styles.displayCentesimos}>.{pad(centesimos)}</Text>
          </View>

          {/* Seção dos Botões de Controle */}
          <View style={styles.botoesContainer}>
            <TouchableOpacity
              style={[styles.botao, styles.botaoSecundario]}
              onPress={handleVolta}
              activeOpacity={0.7}
            >
              <Text style={styles.botaoTextoSecundario}>Volta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botao,
                styles.botaoPrincipal,
                rodando && styles.botaoPausar,
              ]}
              onPress={handleIniciarPausar}
              activeOpacity={0.7}
            >
              <Text style={styles.botaoTextoPrincipal}>
                {rodando ? 'Pausar' : tempo === 0 ? 'Iniciar' : 'Continuar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botao, styles.botaoSecundario]}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.botaoTextoSecundario}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* 4. LISTAGEM DE DADOS COM ScrollView - Requisito da Atividade
            Área de rolagem vertical para exibir o número da volta e o tempo registrado
          */}
          <View style={styles.voltasContainer}>
            {voltas.length === 0 ? (
              <Text style={styles.voltasVazioTexto}>Nenhum tempo marcado ainda</Text>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {voltas.map((v, i) => {
                  const vm = Math.floor(v / 6000);
                  const vs = Math.floor((v % 6000) / 100);
                  const vc = v % 100;
                  return (
                    <View key={i} style={styles.voltaItem}>
                      <Text style={styles.voltaNumero}>
                        Volta {voltas.length - i}
                      </Text>
                      <Text style={styles.voltaTempo}>
                        {pad(vm)}:{pad(vs)}.{pad(vc)}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

// Estilização customizada com o tema Midnight Blue (Modo Escuro)
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1e293b', // Fundo externo ardósia escuro
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    borderWidth: 8,
    borderColor: '#0f172a', // Borda simulada do aparelho celular
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  phoneScreen: {
    width: 310,
    height: 540,
    backgroundColor: '#0f172a', // Fundo interno da tela (Preto/Azul Profundo)
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8', // Azul ciano moderno
    letterSpacing: 1.5,
    marginBottom: 25,
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 35,
  },
  displayTempo: {
    fontSize: 54,
    fontWeight: '300',
    color: '#ffffff', // Números principais em branco cristal
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  displayCentesimos: {
    fontSize: 26,
    fontWeight: '300',
    color: '#94a3b8', // Centésimos em cinza claro para destaque secundário
    marginBottom: 6,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  botoesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  botao: {
    width: 82,
    height: 44,
    borderRadius: 12, // Bordas ligeiramente arredondadas modernas
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPrincipal: {
    backgroundColor: '#0ea5e9', // Azul vibrante para Iniciar/Continuar
  },
  botaoPausar: {
    backgroundColor: '#f43f5e', // Rosa/Vermelho para Pausar
  },
  botaoSecundario: {
    backgroundColor: '#334155', // Cinza escuro para os botões laterais
  },
  botaoTextoPrincipal: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  botaoTextoSecundario: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 13,
  },
  voltasContainer: {
    flex: 1,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  voltasVazioTexto: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 13,
    marginTop: 15,
    fontStyle: 'italic',
  },
  voltaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  voltaNumero: {
    fontSize: 14,
    color: '#94a3b8',
  },
  voltaTempo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38bdf8', // Tempo da volta destacado em ciano
    fontVariant: ['tabular-nums'],
  },
});

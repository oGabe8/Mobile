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

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function CronometroApp() {
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [voltas, setVoltas] = useState<number[]>([]);

  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const minutos = Math.floor(tempo / 6000);
  const segundos = Math.floor((tempo % 6000) / 100);
  const centesimos = tempo % 100;

  const handleIniciarPausar = () => {
    if (rodando) {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      setRodando(false);
    } else {
      intervaloRef.current = setInterval(() => {
        setTempo((t) => t + 1);
      }, 10);
      setRodando(true);
    }
  };

  const handleVolta = () => {
    if (rodando || tempo > 0) {
      setVoltas((v) => [tempo, ...v]);
    }
  };

  // Função para zerar o cronômetro e limpar o histórico
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
      {/**/}
      <View style={styles.phoneFrame}>
        <View style={styles.phoneScreen}>

          {/**/}
          <Text style={styles.title}>CRONÔMETRO PRO</Text>

          {/**/}
          <View style={styles.displayContainer}>
            <Text style={styles.displayTempo}>
              {pad(minutos)}:{pad(segundos)}
            </Text>
            <Text style={styles.displayCentesimos}>.{pad(centesimos)}</Text>
          </View>

          {/**/}
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

          {/**/}
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

// Estilização modo escuro
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1e293b', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    borderWidth: 8,
    borderColor: '#0f172a', 
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
    backgroundColor: '#0f172a', 
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#38bdf8', 
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
    color: '#ffffff', 
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  displayCentesimos: {
    fontSize: 26,
    fontWeight: '300',
    color: '#94a3b8', 
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
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoPrincipal: {
    backgroundColor: '#0ea5e9',
  },
  botaoPausar: {
    backgroundColor: '#f43f5e',
  },
  botaoSecundario: {
    backgroundColor: '#334155',
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
    color: '#38bdf8',
    fontVariant: ['tabular-nums'],
  },
});

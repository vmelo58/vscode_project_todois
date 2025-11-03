// Label colors - Todoist style
export const LABEL_COLORS = Object.freeze({
  berry_red: { name: 'Vermelho', color: '#b8256f' },
  red: { name: 'Vermelho Claro', color: '#db4c3f' },
  orange: { name: 'Laranja', color: '#ff9933' },
  yellow: { name: 'Amarelo', color: '#fad000' },
  olive_green: { name: 'Verde Oliva', color: '#afb83b' },
  lime_green: { name: 'Verde Lima', color: '#7ecc49' },
  green: { name: 'Verde', color: '#299438' },
  mint_green: { name: 'Verde Menta', color: '#6accbc' },
  teal: { name: 'Azul Petróleo', color: '#158fad' },
  sky_blue: { name: 'Azul Céu', color: '#14aaf5' },
  light_blue: { name: 'Azul Claro', color: '#96c3eb' },
  blue: { name: 'Azul', color: '#4073ff' },
  grape: { name: 'Uva', color: '#884dff' },
  violet: { name: 'Violeta', color: '#af38eb' },
  lavender: { name: 'Lavanda', color: '#eb96eb' },
  magenta: { name: 'Magenta', color: '#e05194' },
  salmon: { name: 'Salmão', color: '#ff8d85' },
  charcoal: { name: 'Carvão', color: '#808080' },
  grey: { name: 'Cinza', color: '#b8b8b8' },
  taupe: { name: 'Taupe', color: '#ccac93' },
})

// Predefined labels examples
export const DEFAULT_LABELS = Object.freeze([
  { id: 'urgent', name: 'Urgente', color: 'red' },
  { id: 'important', name: 'Importante', color: 'orange' },
  { id: 'home', name: 'Casa', color: 'blue' },
  { id: 'work', name: 'Trabalho', color: 'grape' },
  { id: 'study', name: 'Estudos', color: 'green' },
  { id: 'health', name: 'Saúde', color: 'mint_green' },
])

// Helper to get label color
export const getLabelColor = (colorKey) => {
  return LABEL_COLORS[colorKey]?.color || LABEL_COLORS.grey.color
}

import { User } from '@/types/evaluation'

export const SAMPLE_USERS: User[] = [
{ id: '1', name: 'Haruya Shida', assignedQuestions: ['q1', 'q3', 'q5', 'q12'] },
  { id: '2', name: 'Dmitry Garaev', assignedQuestions: ['q6', 'q9'] },
  { id: '3', name: 'Igor Topcin', assignedQuestions: ['q1', 'q10'] },
  { id: '4', name: 'Da Qu', assignedQuestions: ['q3', 'q5', 'q7', 'q8'] },
  { id: '5', name: 'Uriel Pineda', assignedQuestions: ['q4', 'q10', 'q16', 'q35'] },
  { id: '6', name: 'Abhay Patil', assignedQuestions: ['q4', 'q6', 'q10', 'q17'] },
  { id: '7', name: 'Luke Kelly', assignedQuestions: ['q2', 'q6', 'q11', 'q13'] },
  { id: '8', name: 'Stephanie Liu', assignedQuestions: ['q14', 'q15', 'q19', 'q20', 'q21', 'q23'] },
  { id: '9', name: 'Javier Canizalez', assignedQuestions: ['q22', 'q24', 'q25', 'q27', 'q29', 'q32'] },
  { id: '10', name: 'Neha Jakkaraj', assignedQuestions: ['q28', 'q30', 'q31', 'q34', 'q36', 'q37'] },
  { id: '11', name: 'Uriel Pineda (Pt. 2)', assignedQuestions: ['q9', 'q12', 'q38', 'q39', 'q40'] },
  { id: '12', name: 'Regina Ceballos', assignedQuestions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20','q21', 'q22', 'q23', 'q24', 'q25', 'q26', 'q27', 'q28', 'q29', 'q30', 'q31', 'q32', 'q33', 'q34', 'q35', 'q36', 'q37', 'q38', 'q39', 'q40'] },
]

// General
// 'q4': Uriel, Abhay
// 'q7': Da
// 'q8': Da
// 'q9': Dmitry, Uriel 2
// 'q10': Igor, Uriel, Abhay
// 'q11': Luke
// 'q13': Luke
// 'q14': Stephanie
// 'q15': Stephanie
// 'q18': BAD
// 'q19': Stephanie
// 'q22': Javier
// 'q24': Javier
// 'q25': Javier
// 'q26': BAD
// 'q28': Neha
// 'q30': Neha
// 'q31': Neha
// 'q34': Neha
// 'q37': Neha
// 'q38': Uriel 2
// 'q39': Uriel 2
// 'q40': Uriel 2
// Troubleshooting
// 'q1': Haruya, Igor
// 'q2': BAD - Luke 
// 'q3': Haruya, Da
// 'q5': Haruya, Da
// 'q6': Dmitry, Abhay, Luke
// 'q12': Haruya, Uriel 2
// 'q16': Uriel
// 'q17': Abhay
// 'q20': Stephanie
// 'q21': Stephanie
// 'q23': Stephanie
// 'q27': Javier
// 'q29': Javier
// 'q32': Javier
// 'q33': MISSING
// 'q35': Uriel
// 'q36': Neha

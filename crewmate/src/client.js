import { createClient } from '@supabase/supabase-js'

const URL = 'https://qftasdpioafbhuewwgkw.supabase.co'
const API_KEY = 'sb_publishable_ESiI8cjlSLQuahqBGaLY1Q_C212SoO-'

export const supabase = createClient(URL, API_KEY)
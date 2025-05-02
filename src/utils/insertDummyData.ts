
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Array of emoji options with their corresponding labels and scores
const emojiOptions = [
  { emoji: '😄', label: 'Happy', score: 5 },
  { emoji: '😢', label: 'Sad', score: 2 },
  { emoji: '😠', label: 'Angry', score: 1 },
  { emoji: '🤩', label: 'Excited', score: 5 },
  { emoji: '😐', label: 'Neutral', score: 3 },
  { emoji: '😬', label: 'Anxious', score: 2 },
  { emoji: '😌', label: 'Calm', score: 4 },
  { emoji: '🥱', label: 'Tired', score: 2 }
];

// Array of possible reasons for each mood
const reasonOptions: Record<string, string[]> = {
  'Happy': [
    'Great team meeting today!',
    'Finished a big project',
    'Got praised by my manager',
    'Learned something new',
    'Had a good lunch with colleagues'
  ],
  'Sad': [
    'Missed a deadline',
    'Got negative feedback',
    'Personal issues affecting work',
    'Project didn\'t go as planned',
    'Feeling undervalued'
  ],
  'Angry': [
    'Frustrated with technical issues',
    'Miscommunication with colleague',
    'Client changed requirements last minute',
    'Meeting that could have been an email',
    'Too much bureaucracy'
  ],
  'Excited': [
    'New project kickoff!',
    'Just got promoted',
    'Innovative idea approved',
    'Team outing planned',
    'Good quarterly results'
  ],
  'Neutral': [
    'Regular day at work',
    'Neither good nor bad',
    'Steady workload',
    'Routine meetings',
    'Same as usual'
  ],
  'Anxious': [
    'Upcoming presentation',
    'Tight deadline',
    'Performance review soon',
    'Uncertain about project direction',
    'Worried about team changes'
  ],
  'Calm': [
    'Well-planned day',
    'Everything under control',
    'Good work-life balance today',
    'Productive without stress',
    'Peaceful working environment'
  ],
  'Tired': [
    'Long meetings all day',
    'Not enough sleep',
    'Overworked this week',
    'Need a break',
    'Too many context switches'
  ]
};

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random date within the past 30 days
const getRandomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(0, daysBack));
  date.setHours(getRandomInt(8, 18), getRandomInt(0, 59), getRandomInt(0, 59));
  return date.toISOString();
};

// Function to generate a batch of dummy data
const generateDummyData = (count: number) => {
  const dummyData = [];

  for (let i = 0; i < count; i++) {
    // Select a random emoji option
    const emojiOption = emojiOptions[getRandomInt(0, emojiOptions.length - 1)];
    
    // Select a random reason based on the mood
    const reasons = reasonOptions[emojiOption.label];
    const reason = reasons[getRandomInt(0, reasons.length - 1)];

    // Create a check-in record
    const checkIn = {
      emoji: emojiOption.emoji,
      label: emojiOption.label,
      score: emojiOption.score,
      reason: reason,
      created_at: getRandomDate(30)
    };

    dummyData.push(checkIn);
  }

  return dummyData;
};

// Interface to match the expected type for emotion_checkins table
interface EmotionCheckin {
  emoji: string;
  label: string;
  score: number;
  reason: string | null;
  created_at: string;
  user_id?: string | null;
  id?: string;
}

// Main function to insert dummy data
export const insertDummyData = async (count: number = 1000) => {
  try {
    toast.info(`Generating ${count} dummy records...`);
    
    const dummyData = generateDummyData(count) as EmotionCheckin[];
    
    // Insert directly into the database using an RPC function
    // This bypasses RLS policies for inserting dummy data
    const { data, error } = await supabase.rpc('insert_dummy_emotion_data', {
      records: JSON.stringify(dummyData)
    });

    if (error) {
      console.error('Failed to insert dummy data:', error);
      toast.error(`Failed to insert dummy data: ${error.message}`);
      return false;
    }
    
    toast.success(`Successfully inserted ${data || count} dummy records!`);
    return true;
  } catch (error) {
    console.error('Error inserting dummy data:', error);
    toast.error('Failed to insert dummy data');
    return false;
  }
};

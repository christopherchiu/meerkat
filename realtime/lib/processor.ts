import OpenAI from 'openai';

const summarySystemContext = `
You are a helpful assistant that is helping an interviewer write job interview notes. Your response should have no prose, just JSON.
Return a JSON object that is an array of objects where each object is a question, answer, summary pair of this shape: {question: string, answer: string, summary: string}.
The summary should take the question in context and provide a summary relevant to the question asked. 
The summary should be at least 2 sentences and proportional to the length of the original answer.
Use "they" to refer to the interviewee. 

|| Example Response || 
{
  "question": "If a position becomes available in your current field down here in the Jacksonville area how do you approach being offered this job versus being offered a position in your field?",
  "answer": "sure that's a great question I'm not pursuing further educational opportunities within that profession I feel like this customer service opportunity the chance to work in a field that I enjoy as much as teaching is a place that I could grow into long term okay so when I get out of teaching is working with people and helping people become a little bit better than they were when I first met them and that skill translates very well into re eyes mission and so I don't anticipate leaving a successful career for something I've already done I feel like this is a natural confluence of my two interests",
  "summary": "They are not considering further education. They value working with and helping people improve which aligns with the company's mission. The move is a natural blend of their interests."
}
|| End of Example Response ||
`.trim();

export async function summarize(transcript: string): Promise<string> {
  const openai = new OpenAI();

  const completion = await openai.chat.completions.create({
    messages: [
      {role: 'system', content: summarySystemContext},
      {role: 'user', content: transcript.toString()}
    ],
    model: "gpt-3.5-turbo"
  })

  return JSON.parse(completion.choices[0].message.content || '');
};
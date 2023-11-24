# %%
import openai
from dotenv import load_dotenv
load_dotenv("../../.env.local")
# %%
USER_PROMPT = """
You are an assistant that helps managers formulate performance summaries for their team members.

These are feedback items and observations from the manager:
{feedback}

From the feedback items and observations provided, please respond with the following JSON object:
{{
"summary": The top 3 bulletpoints that summarizes the context provided. Each bulletpoint must be a single cohesive theme. The summary does not need to be comprehensive. Choose only the top 3 most important themes. This should be an array of 3 strings.
"positive": The positive attributes that the team member exhibits. If company values have been provided, then write these attributes according to those values. This should be a JSON array with keys "attributeName" and "evidence".
"negative": The negative attributes that the team member exhibits. If company values have been provided, then write these attributes according to those values. This should be a JSON array with keys "attributeName" and "evidence".
}}
"""
# %%
FEEDBACK = """
Topic: Project
Context: Led the software project, focused on user interface improvements.
Liked: Really liked how you improved the user interface. Great job using user feedback!
Wished: Wish there was more frequent updates during the project, especially when things got delayed.
Wonder: How about trying Agile or Scrum for the next project? Could help with team coordination and meeting those deadlines.

Topic: Skill
Context: I've been working on improving my presentation skills in the last few team meetings.
I liked: Your content is solid, and you're clear and concise.
I wished: I wish there were more visuals to break up the text.
I wonder: Have you considered storytelling or interactive elements? Might make things more engaging.

Topic: Attribute
Context: I've been trying to be more assertive in group discussions.
I liked: You’re speaking up more, which is great.
I wished: Sometimes, it feels a bit too forceful.
I wonder: Maybe balance your points with questions to others? It can help in softening the approach.

Topic: Meeting
Context: I chaired the last project review meeting.
I liked: You kept the meeting on track and covered all points.
I wished: Some team members seemed disengaged.
I wonder: How about more interactive elements, like quick polls or round-table discussions?

Topic: Skill
Context: Presented at the client meeting about our new product.
Situation: You presented to a key client.
Behavior: Good content, but some points were too technical.
Impact: The client seemed a bit confused at times.
Expectation: Aim for simplicity and clear takeaways in your presentations. Practice with a non-expert beforehand to gauge understanding.

Topic: Skill
Context: I've been working on enhancing my presentation skills, especially during the monthly project reviews.
Response: Your improvement in presentation skills is noticeable. You articulate your points clearly and confidently. To enhance audience engagement, consider incorporating more visual aids and real-life examples related to our work. This could make the data more relatable and impactful.

Impressive problem-solving skills and clear communication. Needs to delegate more, taking on too much. Potential leader.

Presentation skills have improved significantly. Engaging and clear. However, needs to work on time management.
"""
# %%
message = USER_PROMPT.format(feedback=FEEDBACK)
messages = [{'role': 'user', 'content': message}]
response = openai.chat.completions.create(
    model='gpt-4-1106-preview',
    messages=messages,
    temperature=0.7,
    response_format={'type': 'json_object'}
)
print(response.choices[0].message.content)
# %%

# Docker Mastery: The Complete Toolset From a Docker Captain

> Build, compose, deploy, and manage Docker containers from development to DevOps based Swarm clusters

This repo is for use in my Udemy Courses "Docker Mastery" and "Swarm Mastery"

Coupons and Purchase Links and Sample Videos at https://www.bretfisher.com/docker

Docker Mastery Slack Chat Community for Docker, Swarm, Kubernetes, DevOps, and anything Containers:

https://dockermasterychat.herokuapp.com/

Feel free to create issues or PRs if you find a problem.



Background:
Traditionally, our Black Duck project naming followed a clear pattern: organization/projectName, where the organization and project name were separated by a forward slash. This allowed us to easily distinguish the organization from the project and ensured consistency across all integrations, whether GitHub Cloud, GitHub On-Prem, or Azure ADO projects.

Current Issue:
Recently, we noticed that some new GitHub-related projects have shifted to a naming convention that replaces the forward slash with a dash. For example, instead of organization/projectName, we now see organization-projectName. While this might seem minor, it introduces two key challenges:
	1.	Automation Complexity: Our existing automation scripts and tooling rely on the predictable naming pattern to parse organization and project names. Introducing dashes in place of slashes means we lose that clarity and might have to rework or update scripts, increasing maintenance overhead.
	2.	Readability and Consistency: With two dashes in the name, it becomes harder to quickly distinguish the organization from the project at a glance. This can lead to confusion when navigating multiple projects and makes it less intuitive for teams to understand naming at a glance.

Recommendation:
We recommend reverting to the previous naming convention (organization/projectName) to maintain consistency and avoid these issues. This will ensure that our automation scripts remain stable and that we continue to have a clear, readable naming scheme. If there are specific reasons for the change, we’d appreciate understanding them better so we can find a solution that meets everyone’s needs.

I have successfully achieved all the success criteria for this goal. I completed the Microsoft Azure AI Fundamentals Certification (2025), building a strong foundation in AI security, secure model design, and data privacy. For the second objective, I explored and evaluated LLM-based code analysis tools using Cursor, assessing their accuracy and limitations in identifying secure versus insecure patterns. Additionally, I attended Black Hat 2025, which provided valuable exposure to the latest security practices, trends, and innovations in the AI space. These milestones have significantly strengthened my knowledge in AI development, AI-driven security solutions, and secure AI system design and usage.

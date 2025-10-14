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


Over the past year, I actively supported development teams by helping them quickly identify, validate, and address security vulnerabilities detected by Checkmarx and BlackDuck. I focused on improving the accuracy of findings, minimizing false positives, and ensuring that remediation efforts were prioritized effectively.

I collaborated closely with developers to clarify issues, provide practical remediation guidance, and resolve questions promptly, which helped keep projects moving without security-related delays. I also stayed current with evolving security standards and best practices, strengthening my ability to offer valuable insights and recommendations for continuous improvement.

Through these efforts, I contributed to reducing security risks in our applications and enhancing the overall maturity of our secure development practices.


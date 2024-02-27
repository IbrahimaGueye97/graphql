import { DrawRadarChart, radius, svg2 } from "./diagramme.js";
import { DrawPieChart, radius2, svg } from "./diagrammeCirculaire.js";
import { GetMaxAmounts } from "./trisSkills.js";

export const fetchData = (infoEncode) => {
  // const storedJwt = localStorage.getItem('jwt');
  return new Promise((resolve, reject) => {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${infoEncode}`,
      },
      body: JSON.stringify({
        query: `
                query {
                  user {
                     id
                    email
                    firstName
                    lastName
                    login
                    campus
                    auditRatio
                    # liste des audits valides
                    validAudits: audits_aggregate(where:{grade:{_gte:1}}){
                      aggregate{
                        count
                      }
                    }
                    # liste des audits non valide
                    invalidAudits: audits_aggregate(where:{grade:{_lt:1}}){
                      aggregate{
                        count
                      }
                    }
                    # Ajoutez d'autres champs désirés ici

                    

                    # Level

                    level: events(where:{event:{registrationId:{_eq:55}}}){
                      level
                    }

                    # Les projets valides 
                    projetValides: progresses(where:{isDone:{_eq:true},event:{registrationId:{_eq:55}}}) {
                      userLogin
                      object{
                        name
                      }
                    }
                  }
                  # transaction pour recuperer le nombre de XP
                  transaction_aggregate(where:{event:{registrationId:{_eq:55}},type:{_eq:"xp"}}){
                    aggregate{
                      sum{
                        amount
                      }
                    }
                  }
                  # transaction pour les skill prog
                  skill: transaction(
                    where: {
                      _or: [
                        { type: { _eq: "xp" }, eventId: { _eq: 55 } },
                        { type: { _ilike: "skill_%" } }
                      ]
                    }
                  ) {
                   type
                   amount
                  }

                  # Derniere audit
                  up: transaction_aggregate(where: {type: {_eq: "up"}}){
                    aggregate{
                      sum{
                        amount
                      }
                    }
                  }
                    
                  down: transaction_aggregate(where: {type: {_eq: "down"}}){
                    aggregate{
                      sum{
                        amount
                      }
                    }
                  }
                }
              `,
      }),
    };

    fetch(
      "https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql",
      fetchOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          reject(new Error("GraphQL errors: " + JSON.stringify(data.errors)));
          return; // Handle errors appropriately
        }
        // Traitez les données récupérées
        const user = data.data.user;
        user.forEach((element) => {
          // diagramme circulaire pour les audits valider et invalider
          const tabAudis = [];
          const validAudit = {
            label: "Valid Audits",
            count: element.validAudits.aggregate.count,
          };
          const invalidAudit = {
            label: "Invalid Audits",
            count: element.invalidAudits.aggregate.count,
          };
          tabAudis.push(validAudit, invalidAudit);
          DrawPieChart(tabAudis, radius2, radius2, radius2);

          const containerCir = document.querySelector(".cir");
          containerCir.appendChild(svg);

          // Informations pour l'utilsateur
          let level = user[0].level;
          infoUserConnect(
            element.firstName,
            element.lastName,
            element.email,
            element.login,
            element.campus,
            element.auditRatio,
            level[0].level
          );
          element.level.forEach((el) => {
            level.innerHTML = el.level;
          });
          let projetValides = element.projetValides;
          createTab(projetValides);
        });
        console.log(data.data.up.aggregate.sum.amount);
        console.log(data.data.down.aggregate.sum.amount);
        const maxAmount = GetMaxAmounts(data.data.skill);
        DrawRadarChart(maxAmount, radius, radius, radius);
        const chart = document.querySelector(".chart");
        chart.appendChild(svg2);
        let val = data.data.transaction_aggregate.aggregate.sum.amount / 1000;
        let nbrXp = document.querySelector(".xp");
        nbrXp.innerHTML = val.toFixed(0) + " KB";
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createTab = (projetValides) => {
  projetValides.forEach((projet) => {
    let name = projet.object.name;
    let tableProject = document.querySelector("tbody");
    let line = document.createElement("tr");
    let column = document.createElement("td");
    column.innerText = name;
    line.appendChild(column);
    tableProject.appendChild(line);
  });
};

const infoUserConnect = (
  firstName,
  lastName,
  email,
  userName,
  campuss,
  auditRatio,
  myLevel
) => {
  let nameUser = document.querySelector(".info-user");
  let name = document.querySelector(".name");
  let mail = document.querySelector(".email");
  let gitea = document.querySelector(".gitea");
  let campus = document.querySelector(".campus");
  let ratio = document.querySelector(".auditRatio");
  let level = document.querySelector(".level");
  nameUser.innerHTML = firstName + " " + lastName;
  name.innerHTML = firstName + " " + lastName;
  mail.innerHTML = email;
  gitea.innerHTML = userName;
  campus.innerHTML = campuss;
  if (auditRatio > 1) {
    ratio.style.color = "green";
  } else {
    ratio.style.color = "red";
  }
  ratio.style.fontSize = "45px";
  ratio.innerHTML = auditRatio.toFixed(1);
  level.innerHTML = myLevel;
};

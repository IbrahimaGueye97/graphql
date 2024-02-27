export class Home {
  getHtml() {
    return `
    <div class="container">
        <div class="header">
        <div class="info-user"></div>
            <div class="disconnect" id="disconnect">
            <img src="./img/arreter-icone-recto-fond-blanc-removebg-preview.png" alt="">
            </div>
        </div>
        <div class="content-top">
        <div class="elem elem1">
        <div>
            <h1>Information user</h1>
            <div class="name"></div>
            <div class="email"></div>
            <div class="gitea"></div>
            <div class="campus"></div>
        </div>
            </div>
            <div class="elem elem2">
            <table class="tableProject">
  <thead>
    <tr>
      <th>Projects Name</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>
            </div>
            </div>
            <div class="content-middel">
            <div class="elem elem3">
            <h3>Total XP</h3>
                <div class="xp"></div>
            </div>
            <div class="elem elem4">
                <h3>Audits ratio</h3>
                <div class="auditRatio"></div>
            </div>
            <div class="elem elem5">
            <h3>Current level</h3>
            <div class="level"></div>
            </div>
        </div>
        <div class="content-bottom">
            <div class="elem elem6">
            <div>Audits: valide et invalide</div>
            <div class="cir"></div>
            <div id="hoverInfoCircul"></div>
            </div>
            <div class="elem elem7">
            <div>Skill programmation</div>
            <div class="chart">
            </div>
            <div id="hoverInfo"></div>
            </div>
        </div>
    </div>
            `;
  }
}

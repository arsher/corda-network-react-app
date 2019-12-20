# START/BUILD PROJECT:

In the root folder of the app make sure that node_modules folder is available, if not or if ant updates of packages recently please run
`npm install`
In order to start the app locally you need to run at root level
`npm run start`
In order to buld the app for the ssite only or for full functionality you need to run at root level
`npm run buld`
Files in the build folder can be transfered and should replace those in
`https://github.com/corda-network/corda-network.github.io` root folder to go live

# IMPORTANT FILES:

-
`/src/utils/constants.js`
contains the base url for the markdown pages

- `/package.json`
  contains project name, dependencies, and build scripts
- `/src/App.jsx`
- `/src/coponents/Header/Header.jsx`
- `/src/components/Navigation/Navigation.jsx`
  those three files in the `Site Only` folder contain commented links and routes for the user functionlatity in the site only source
- `/src/axios/axios.jsx`
  contains the API URLs for staging and production, one of which should be commented depending on the build goal

# How to create a new page

## Step by step

1. Create a new .md file with desired content in the respective directory in github.
2. Go to directory "Site" located in: "onboarding -> src -> containers -> Site"
3. Choose the respective section/directory (e.g. About, Governance, Participation, etc.).
4. Create a new directory with the same name as the new .md file.
5. Create a new .jsx file with the same name as the .md file. For example: "NewPage -> NewPage.jsx"
6. Use the same content as the rest of the .jsx file. Change only the id and the classes to be the same as the name of the new .md file.
7. !!!The div which wraps the content of the new page `<ReactMarkdown source={pageText} />` should have the class `inner-page`!!!
8. Each main section/directory has a .jsx file whith the same name as the main section/directory. Locate it and add the route to the new page. The path should be the same as the path of the .md file in github. E.g. `` <Route path={`${match.url}/new-page`} component={NewPage} /> ``
9. Create a new link leading to the new page in the submenu in the respective section/directory in Navigation.jsx.
10. To update the breadcrumb, locate "Breadcrumb.jsx" and add the path to the parent/main section/directory in "cnfPaths" array (e.g. About, Governance, Participation, etc.). In "breadcrumbMap" object add the name you wish to display in the breadcrumb on the new page. Example: `'/minutes/index': 'Minutes and Governance Events of Board Meetings'`
11. Locate BottomBar.jsx and include the path to the main/parent section/directory in "cnfPaths" array.

## This is how this component should look like:

```
import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class NewPage extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="new-page" className="row new-page">
                    <div className="inner-page new-page-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(NewPage);
```

## This is how the menu link to the new page should look like:

```
<li className="nav-item sub">
    <NavLink
        className="nav-link"
        to="/about/new-page"
        onClick={
            this.handleClick
        }>
        New Page
    </NavLink>
</li>
```

The component which fetches the content is page.jsx (onboarding -> src -> hoc -> page -> page.jsx).

## How to create a new main/parent section/directory

1. Locate directory "Site".
2. Create a new directory with the same name as the new section (Example: Minutes). In it create the main .jsx file (Example: Minutes.jsx). In this .jsx file will be placed the rautes to the new pages.
3. In App.jsx add the route to the new section. Example: `<Route path="/minutes" component={Minutes} />`
4. After the steps above follow the steps to create a new page.
5. In Navigation.jsx create a new tab for the new section and submenu with the new pages.

# LICENSE for 3rd party libraries:

- **@mdi/font**:
  version: ^4.4.95
  address: https://www.npmjs.com/package/@mdi/font
  license: none

- **axios**:
  version: ^0.19.0
  address: https://www.npmjs.com/package/axios
  license: MIT

* **base-64**:
  version: ^0.1.0
  address: https://www.npmjs.com/package/base-64
  license: none

- **firebase**:
  version: ^7.1.0
  address: https://www.npmjs.com/package/firebase
  license: Apache-2.0

- **jspdf**:
  version: ^1.5.3
  address: https://www.npmjs.com/package/jspdf
  license: MIT

- **jwt-decode**:
  version: ^2.2.0
  address: https://www.npmjs.com/package/jwt-decode
  license: MIT

* **markdown-to-jsx**:
  version: ^6.10.3
  address: https://www.npmjs.com/package/markdown-to-jsx
  license: MIT

- **node-sass**:
  version: ^4.12.0
  address: https://www.npmjs.com/package/node-sass
  license: MIT

* **prop-type**:
  version: ^15.7.2
  address: https://www.npmjs.com/package/prop-types
  license: MIT

* **react**:
  version: ^16.9.0
  address: https://www.npmjs.com/package/react
  license: MIT

* **react**:
  version: ^16.9.0
  address: https://www.npmjs.com/package/react
  license: MIT

* **react-dom**:
  version: ^16.9.0
  address: https://www.npmjs.com/package/react-dom
  license: MIT

- **react-google-invisible-recaptcha**:
  version: ^0.2.11
  address: https://www.npmjs.com/package/react-google-invisible-recaptcha
  license: MIT

- **react-loading-overlay**:
  version: ^1.0.1
  address: https://www.npmjs.com/package/react-loading-overlay
  license: none

- **react-markdown**:
  version: ^4.2.2
  address: https://www.npmjs.com/package/react-markdown
  license: MIT

- **react-modal**:
  version: ^3.10.1
  address: https://www.npmjs.com/package/react-modal
  license: MIT

- **react-paginate**:
  version: ^6.3.0
  address: https://www.npmjs.com/package/react-paginate
  license: MIT

- **react-redux**:
  version: ^7.1.1
  address: https://www.npmjs.com/package/react-redux
  license: MIT

- **react-router-dom**:
  version: ^5.0.1
  address: https://www.npmjs.com/package/react-router-dom
  license: MIT

- **react-scripts**:
  version: 3.1.1
  address: https://www.npmjs.com/package/react-scripts
  license: MIT

- **react-select**:
  version: ^3.0.8
  address: https://www.npmjs.com/package/react-select
  license: MIT

- **react-toastify**:
  version: ^5.4.0
  address: https://www.npmjs.com/package/react-toastify
  license: MIT

- **react-with-firebase-auth**:
  version: ^1.1.0
  address: https://www.npmjs.com/package/react-with-firebase-auth
  license: MIT

- **redux**:
  version: ^4.0.4
  address: https://www.npmjs.com/package/redux
  license: MIT

- **typeface-rubik**:
  version: 0.0.72
  address: https://www.npmjs.com/package/typeface-rubik
  license: MIT

*MIT - The MIT License is a permissive free software license originating at the Massachusetts Institute of Technology (MIT)[5] in the late 1980s.[6] As a permissive license, it puts only very limited restriction on reuse and has, therefore, reasonable license compatibility.
*APACHE-2.0 - OSI Approved License: https://opensource.org/licenses/Apache-2.0. The 2.0 version of the Apache License, approved by the ASF in 2004, helps us achieve our goal of providing reliable and long-lived software products through collaborative open source software development.
\*none - unlicensed

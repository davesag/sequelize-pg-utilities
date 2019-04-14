const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiAlmost = require('chai-almost')
const chaiAsPromised = require('chai-as-promised')

chai.use(sinonChai)
chai.use(chaiAsPromised)
chai.use(chaiAlmost(10))

const faker = require('faker')
const { camelCase } = require('lodash')

const {
  permissionsByRole,
  rolesToPermissions,
} = require('../../common/lib/permissions')
const { generateAssessmentRespones } = require('../../mocks/assessment')

const permittedActions = {
  requested: {
    method: 'accept',
    data: null,
  },
  booked: {
    method: 'start',
    data: null,
  },
  in_transit: {
    method: 'complete',
    data: {
      notes: faker.lorem.sentence(),
    },
  },
}

function renderPermissions(req, res) {
  res.render('tools/views/permissions', {
    activeRoles: req.session.activeRoles || [],
    roles: permissionsByRole,
    redirect: req.query.r,
  })
}

function updatePermissions(req, res) {
  let roles = req.body.roles || []

  if (roles.includes('ALL')) {
    roles = Object.keys(permissionsByRole)
  }

  const permissions = rolesToPermissions(roles)

  req.session.activeRoles = roles

  req.session.user = req.session.user || {}
  req.session.user.permissions = permissions

  const redirectUrl = req.body.redirect?.startsWith('/')
    ? req.body.redirect
    : '/'

  res.redirect(redirectUrl)
}

async function updateMoveStatus(req, res, next) {
  try {
    const moveId = req.params.moveId
    const currentStatus = req.params.currentStatus
    const action = permittedActions[currentStatus]

    if (action) {
      await req.services.move[action.method](moveId, action.data)
    }

    res.redirect(`/move/${moveId}`)
  } catch (error) {
    next(error)
  }
}

async function completeAssessment(req, res, next) {
  try {
    const { services = {} } = req
    const { assessmentId, type = '' } = req.params
    const service = services[camelCase(type)]

    if (!service) {
      return res.redirect('/')
    }

    const assessment = await service.getById(assessmentId)
    const responses = generateAssessmentRespones(assessment.responses)
    await service.respond(assessmentId, responses)

    res.redirect(`/move/${assessment.move.id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderPermissions,
  updatePermissions,
  updateMoveStatus,
  completeAssessment,
}

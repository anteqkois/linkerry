export enum ConditionTypeType {
  ALERT = 'alert',
  INDICATOR = 'indicator',
}

// It's important in condition, not Event
export enum ConditionOperatorType {
  // 'equal' = 'equal',
  CROSSING = 'crossing',
  CROSSING_UP = 'crossingUp',
  CROSSING_DOWN = 'crossingDown',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  // Entering Channel= '' // User must defined bands
  // Exiting Channel= ''
  // Inside Channel= ''
  // Outside Channel= ''
  MOVING_UP = 'movingUp', // Value => $300
  MOVING_DOWN = 'movingDown',
  MOVING_UP_PERCENT = 'MovingUpPercent', // % => 10%
  MOVING_DOWN_PERCENT = 'MovingDownPercent',
}

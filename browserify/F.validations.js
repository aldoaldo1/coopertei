// V = Validations

F.V.len = function(el) {
  return $(el).val().length > 0;
};

F.V.equal = function(x, y) {
  return $(x).val() === $(y).val();
};

F.V.alpha = function(label, field, success, failure) {
  if (F.V.len($(field))) {
    success();
  } else {
    failure('El campo "' + label + '" no puede estar vac&iacute;o');
  }
};

F.V.numeric = function(label, field, success, failure) {
  try {
    Validate.Numericality(parseInt($(field).val()));
    success();
  } catch (e) {
    failure('El campo "' + label + '" s&oacute;lo acepta n&uacute;meros');
  }
};

F.V.integer = function(label, field, success, failure) {
  try {
    Validate.Numericality(parseInt($(field).val()), { onlyInteger: true });
    success();
  } catch (e) {
    failure('El campo "' + label + '" s&oacute;lo acepta n&uacute;meros enteros');
  }
};

F.V.range = function(label, field, success, failure) {
  try {
    Validate.Numericality(parseInt($(field).val()), { minimum: field.min, maximum: field.max });
    success();
  } catch (e) {
    failure('El campo "' + label + '" s&oacute;lo acepta n&uacute;meros entre ' + field.min + ' y ' + field.max);
  }
};

F.V.passwords = function(pass1, pass2, success, failure) {
  if (!F.V.len(pass1) || !F.V.len(pass2)) {
    failure('Las contrase&ntilde;as son obligatorias');
    return false;
  }
  if (!F.V.equal(pass1, pass2)) {
    failure('Las contrase&ntilde;as deben ser iguales');
    return false;
  }

  success();
  return true;
};

F.V.email = function(label, field, success, failure) {
  try {
    Validate.Email($(field).val());
    success();
  } catch (e) {
    failure('El campo ' + label + ' es incorrecto');
  }
};

F.V.cuit = function(label, field, success, failure) {
  // TODO
  return true;
};

F.V.formSimple = function(form, onError) {
  _.each(F.getFormFields(form), function(f) {
    var error_inputtext = $(f).is('input:text') && !$(f).length,
        error_select = $(f).is('select') && $(f).val() === -1,
        error_textarea = $(f).is('textarea') && !$(f).length;

    if (error_inputtext || error_select || error_textarea) {
      onError();
    }
  });
};

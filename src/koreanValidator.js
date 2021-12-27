import { required, email, minLength, maxLength, sameAs, helpers } from '@vuelidate/validators';

const kRequired = helpers.withMessage(
  '빈칸을 채워주세요',
  required
)

const kEmail = helpers.withMessage(
  '올바른 이메일 형식이 아닙니다',
  email
)

const kMinLength = helpers.withMessage(
  '최소 6자리 이상이어야합니다',
  minLength(6)
)

const kMaxLength = helpers.withMessage(
  '너무 긴 이름은 허용되지 않습니다',
  maxLength(12)
)

const kSameAs = (val) => helpers.withMessage(
  '비밀번호가 일치하지 않습니다',
  sameAs(val)
)

const kAgree = helpers.withMessage(
  '동의함에 체크하셔야합니다',
  sameAs(true)
)

export {
  kRequired,
  kEmail,
  kMinLength,
  kMaxLength,
  kSameAs,
  kAgree
}
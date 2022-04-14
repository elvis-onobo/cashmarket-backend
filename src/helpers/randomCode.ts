import randomstring from 'randomstring'

export default function randomCode(): string{
    return randomstring.generate(12)
}
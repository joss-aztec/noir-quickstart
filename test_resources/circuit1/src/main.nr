use dep::std;

fn main(x : Field, y : pub Field) -> pub Field {
    constrain x != y;
    std::hash::pedersen([x])[0]
}
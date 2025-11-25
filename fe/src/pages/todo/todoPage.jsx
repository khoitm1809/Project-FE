import { BoxContainer } from "../../components/commonStyled";
import { useAddTodoMutation, useDeleteTodoMutation, useEditTodoMutation, useGetListTodoQuery } from "../../store/todo/todoAction";


const DetailBarnPage = () => {
    const [addTodo] = useAddTodoMutation();
    const [editTodo] = useEditTodoMutation();
    const [deleteTodo] = useDeleteTodoMutation();
    const {
        data: listDoto,
        isLoading: loadingListTodo,
        refetch
    } = useGetListTodoQuery({},
        { refetchOnMountOrArgChange: true }
    );


    return (
        <BoxContainer padding={'2rem'}>

        </BoxContainer>
    );
}

export default DetailBarnPage;